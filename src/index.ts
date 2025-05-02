import express, { Request, Response } from 'express';
import { getNewsData } from './getNewsData';
import { generatePrompt } from './generatePrompt';
import { makeOutboundCall } from './makeOutboundCall';

const app = express();
app.use(express.json());

interface IrisResearchRequest {
  phoneNumber: string;
  query: string;
}

interface IrisResearchResponse {
  success: boolean;
  message: string;
  error?: string;
}

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

app.post('/mcp/tools/iris-research', async (req: Request<IrisResearchRequest>, res: Response<IrisResearchResponse>) => {
  const { phoneNumber, query } = req.body;
  
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

export default app;