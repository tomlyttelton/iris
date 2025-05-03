/**
 * Main entry point for the Iris Research MCP server.
 * This module sets up an Express server with MCP protocol support for research queries.
 */

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import { IrisMcpServer } from "./irisResearch.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/mcp", async (req, res) => {
  const body = normalizeToJsonRpc(req.body);

  try {
    const server = IrisMcpServer.getInstance();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, body);
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
 * Handles GET requests to /mcp endpoint (not allowed)
 * @param {Request} _req - Express request object
 * @param {Response} res - Express response object
 */
app.get("/mcp", (_req, res) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed.",
    },
    id: null,
  });
});

/**
 * Handles DELETE requests to /mcp endpoint (not allowed)
 * @param {Request} _req - Express request object
 * @param {Response} res - Express response object
 */
app.delete("/mcp", (_req, res) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed.",
    },
    id: null,
  });
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

/**
 * Nasty shim to normalize the request body to JSON-RPC format for Vapi.
 *
 * @param {Object} body - The request body
 * @returns {Object} The normalized request body
 */
function normalizeToJsonRpc(body?: {
  jsonrpc: string;
  method: string;
  name?: string;
  phoneNumber?: string;
  query?: string;
}) {
  if (body?.jsonrpc === "2.0" && typeof body?.method === "string") {
    return body;
  }

  const { name, phoneNumber, query } = body ?? {};
  return {
    jsonrpc: "2.0",
    id: "vapi-fallback",
    method: "iris-research",
    params: { name, phoneNumber, query },
  };
}
