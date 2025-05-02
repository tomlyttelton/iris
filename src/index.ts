import express from 'express';
import { Request, Response } from 'express';
import { getNewsData } from './getNewsData';
import { generatePrompt } from './generatePrompt';
import { makeOutboundCall } from './makeOutboundCall';

const app = express();
app.use(express.json());

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

interface IrisResearchRequest {
  phoneNumber: string;
  query: string;
}

interface IrisResearchResponse {
  success: boolean;
  message: string;
  error?: string;
}

interface ToolParams {
  phoneNumber: string;
  query: string;
}

// Helper function to handle MCP protocol messages
function handleMcpMessage(message: any, res: Response) {
  console.log('Processing MCP message:', message);
  
  if (message.method === 'initialize') {
    // Respond to initialization with required fields
    const response = {
      jsonrpc: '2.0',
      id: message.id,
      result: {
        protocolVersion: '2024-03-01', // Required field
        serverInfo: { // Required field
          name: 'iris-research-server',
          version: '1.0.0'
        },
        capabilities: {}
      }
    };
    res.write(`data: ${JSON.stringify(response)}\n\n`);
  }
  else if (message.method === 'list_tools') {
    // Tool discovery
    const response = {
      jsonrpc: '2.0',
      id: message.id,
      result: {
        tools: [
          {
            id: "iris-research",
            name: "Iris Research",
            description: "Scrapes current news, generates a response, and places a phone call using Vapi.",
            input_schema: {
              type: "object",
              required: ["phoneNumber", "query"],
              properties: {
                phoneNumber: { 
                  type: "string", 
                  description: "Recipient's phone number in E.164 format" 
                },
                query: { 
                  type: "string", 
                  description: "User's query or research topic" 
                }
              }
            }
          }
        ]
      }
    };
    
    res.write(`data: ${JSON.stringify(response)}\n\n`);
  } 
  else if (message.method === 'call_tool' && message.params.tool_id === 'iris-research') {
    // Tool execution
    const params = message.params.params as ToolParams;
    const { phoneNumber, query } = params;
    
    if (!phoneNumber || !query) {
      const errResponse = {
        jsonrpc: '2.0',
        id: message.id,
        error: {
          code: -32602,
          message: 'Missing required parameters'
        }
      };
      res.write(`data: ${JSON.stringify(errResponse)}\n\n`);
      return;
    }
    
    // Execute the tool asynchronously
    getNewsData().then(news => {
      return generatePrompt(news);
    }).then(prompt => {
      return makeOutboundCall(phoneNumber, prompt);
    }).then(() => {
      const response = {
        jsonrpc: '2.0',
        id: message.id,
        result: {
          success: true,
          message: 'Call placed successfully'
        }
      };
      
      res.write(`data: ${JSON.stringify(response)}\n\n`);
    }).catch(err => {
      console.error(err);
      const errResponse = {
        jsonrpc: '2.0',
        id: message.id,
        error: {
          code: -32000,
          message: 'Failed to process request',
          data: err instanceof Error ? err.message : 'Unknown error occurred'
        }
      };
      
      res.write(`data: ${JSON.stringify(errResponse)}\n\n`);
    });
  }
  else {
    // Unknown method
    const errResponse = {
      jsonrpc: '2.0',
      id: message.id,
      error: {
        code: -32601,
        message: `Method not found: ${message.method}`
      }
    };
    
    res.write(`data: ${JSON.stringify(errResponse)}\n\n`);
  }
}

// Shared SSE request handler for both GET and POST
function handleSseRequest(req: Request, res: Response) {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  console.log('SSE request received:', req.method);
  
  // Send a heartbeat every 30s to keep the connection alive
  const heartbeatInterval = setInterval(() => {
    res.write('event: heartbeat\ndata: {}\n\n');
  }, 30000);
  
  // Handle client disconnect
  req.on('close', () => {
    clearInterval(heartbeatInterval);
    console.log('Client disconnected');
  });

  // If the request is a POST, we may already have the body parsed
  if (req.method === 'POST' && req.body) {
    try {
      console.log('Processing POST body:', req.body);
      handleMcpMessage(req.body, res);
    } catch (err) {
      console.error('Error processing POST body:', err);
    }
  }
  
  // For both GET and POST, listen for data events
  req.on('data', (chunk) => {
    try {
      const data = chunk.toString();
      if (!data) return;
      
      console.log('Data received:', data);
      const message = JSON.parse(data);
      handleMcpMessage(message, res);
    } catch (err) {
      console.error('Error processing chunk:', err);
    }
  });
  
  // Initial connection confirmation
  console.log('Sending connection confirmation');
  res.write('event: connected\ndata: {}\n\n');
}

// Support both GET and POST methods for the SSE endpoint
app.get('/sse', (req: Request, res: Response) => {
  handleSseRequest(req, res);
});

app.post('/sse', (req: Request, res: Response) => {
  handleSseRequest(req, res);
});

// Keep your existing REST endpoints for backward compatibility
app.get('/mcp/manifest', (_req: Request, res: Response) => {
  res.json({
    tools: [
      {
        id: "iris-research",
        name: "Iris Research",
        description: "Scrapes current news, generates a response, and places a phone call using Vapi.",
        input: {
          type: "object",
          required: ["phoneNumber", "query"],
          properties: {
            phoneNumber: { type: "string", description: "Recipient's phone number in E.164 format" },
            query: { type: "string", description: "User's query or research topic" }
          }
        },
        output: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            error: { type: "string" }
          }
        }
      }
    ]
  });
});

app.post('/mcp/tools/iris-research', async (req: Request, res: Response) => {
  const { phoneNumber, query } = req.body as IrisResearchRequest;
  if (!phoneNumber || !query) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters',
      error: !phoneNumber ? 'Missing "phoneNumber"' : 'Missing "query"'
    });
  }
  try {
    const news = await getNewsData();
    const prompt = await generatePrompt(news);
    await makeOutboundCall(phoneNumber, prompt);
    res.status(200).json({
      success: true,
      message: 'Call placed successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to process request',
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    });
  }
});

export const irisApi = app;
