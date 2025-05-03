/**
 * Main entry point for the Iris Research MCP server.
 * This module sets up an Express server with MCP protocol support for research queries.
 */

import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import { IrisMcpServer } from "./irisResearch.js";

const app = express();
app.use(express.json());
app.use(cors());

const transports: Record<
  string,
  StreamableHTTPServerTransport | SSEServerTransport
> = {};

/**
 * Handles POST requests to /mcp endpoint
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
app.post("/mcp", async (req: Request, res: Response) => {
  console.log("Received POST request to /mcp", req.body);
  try {
    const server = IrisMcpServer.getInstance();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    const sessionId = transport.sessionId!;
    transports[sessionId] = transport;

    res.on("close", () => {
      transport.close();
      delete transports[sessionId];
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP request error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

/**
 * Handles GET requests to /mcp endpoint assuming older SSE transport.
 * @param {Request} _req - Express request object
 * @param {Response} res - Express response object
 */
app.get("/mcp", async (_req: Request, res: Response) => {
  console.log("Received GET request to /mcp (deprecated SSE transport)");
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;

  res.on("close", () => {
    delete transports[transport.sessionId];
  });

  const server = IrisMcpServer.getInstance();
  await server.connect(transport);
});

/**
 * Handles DELETE requests to /mcp endpoint (not allowed)
 * @param {Request} _req - Express request object
 * @param {Response} res - Express response object
 */
app.delete("/mcp", (_req, res) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed." },
    id: null,
  });
});

app.post("/messages", async (req: Request, res: Response) => {
  console.log("Received POST request to /messages", req.body);
  const sessionId = req.query.sessionId as string;
  const existingTransport = transports[sessionId];

  if (existingTransport instanceof SSEServerTransport) {
    await existingTransport.handlePostMessage(req, res, req.body);
  } else {
    res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Bad Request: Session ID invalid or uses different protocol",
      },
      id: null,
    });
  }
});

/**
 * Health check endpoint
 * @param {Request} _req - Express request object
 * @param {Response} res - Express response object
 */
app.get("/healthz", (_req, res) => {
  res.status(200).send("OK");
});

// Start server on Cloud Run-provided port
const PORT = parseInt(process.env.PORT || "8080", 10);
app.listen(PORT, () => {
  console.log(`Iris Research MCP server running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  for (const sessionId in transports) {
    try {
      await transports[sessionId].close();
    } catch (err) {
      console.error(`Error closing transport ${sessionId}:`, err);
    }
    delete transports[sessionId];
  }
  IrisMcpServer.getInstance().close();
  process.exit(0);
});
