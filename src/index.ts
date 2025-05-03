import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import { z } from "zod";
import { research, ResearchParams } from "./research.js";

const app = express();
app.use(express.json());
app.use(cors());

function getServer(): McpServer {
  const server = new McpServer({
    name: "iris-research-server",
    version: "1.0.0",
  });

  server.tool(
    "iris-research",
    {
      phoneNumber: z
        .string()
        .describe("Recipient's phone number in E.164 format"),
      query: z.string().describe("User's query or research topic"),
    },
    async ({ phoneNumber, query }: ResearchParams) => {
      try {
        const result = await research({ phoneNumber, query });
        return {
          content: [{ type: "text", text: result.message }],
        };
      } catch (error: unknown) {
        const err = error as Error;
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.message || "Failed to process request"}`,
            },
          ],
        };
      }
    }
  );

  return server;
}

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

// Optional: disallow GET and DELETE for /mcp
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

app.get("/healthz", (_req, res) => {
  res.status(200).send("OK");
});

// Start server on Cloud Run-provided port
const PORT = parseInt(process.env.PORT || "8080", 10);
app.listen(PORT, () => {
  console.log(`Iris Research MCP server running on port ${PORT}`);
});
