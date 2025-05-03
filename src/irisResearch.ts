import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { research } from "./research.js";

export class IrisMcpServer {
  private static instance: McpServer | null = null;

  private constructor() {}

  static getInstance(): McpServer {
    if (!IrisMcpServer.instance) {
      const server = new McpServer({
        name: "iris-research-server",
        version: "1.0.0",
      });

      server.tool(
        "iris-research",
        "Automates research and initiates a follow-up phone call. This tool performs the research asynchronously and then triggers an outbound phone call to the recipient.",
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

      IrisMcpServer.instance = server;
    }
    return IrisMcpServer.instance;
  }
}
