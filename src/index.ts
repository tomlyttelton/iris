/**
 * Main entry point for the Iris Research MCP server.
 * This module sets up an Express server with MCP protocol support for research queries.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import { z } from "zod";
import { research } from "./research.js";

const app = express();
app.use(express.json());
app.use(cors());

/**
 * Creates and configures an MCP server instance with the research tool.
 * @returns {McpServer} Configured MCP server instance
 */
function getServer(): McpServer {
  const server = new McpServer({
    name: "iris-research-server",
    version: "1.0.0",
  });

  server.tool(
    "iris-research",
    {
      name: z.string().describe("Name of the recipient"),
      phoneNumber: z
        .string()
        .describe("Recipient's phone number in E.164 format"),
      query: z.string().describe("User's query or research topic"),
    },
    async ({
      name,
      phoneNumber,
      query,
    }: {
      name: string;
      phoneNumber: string;
      query: string;
    }) => {
      research(name, phoneNumber, query)
        .then(() => {
          console.log(`Research and call for ${name} completed.`);
        })
        .catch((err) => {
          console.error(`Error during research for ${name}:`, err);
        });

      return {
        content: [
          {
            type: "text",
            text: `Got it. I'll call ${name} at ${phoneNumber} about "${query}" shortly.`,
          },
        ],
      };
    }
  );

  return server;
}

/**
 * Handles MCP protocol requests
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
app.post("/mcp", async (req: Request, res: Response) => {
  try {
    const server = getServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      transport.close();
      server.close();
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
