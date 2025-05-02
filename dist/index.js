"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getNewsData_1 = require("./getNewsData");
const generatePrompt_1 = require("./generatePrompt");
const makeOutboundCall_1 = require("./makeOutboundCall");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/mcp/manifest', (_req, res) => {
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
app.post('/mcp/tools/iris-research', async (req, res) => {
    const { phoneNumber, query } = req.body;
    if (!phoneNumber || !query) {
        return res.status(400).json({
            success: false,
            message: 'Missing required parameters',
            error: !phoneNumber ? 'Missing "phoneNumber"' : 'Missing "query"'
        });
    }
    try {
        const news = await (0, getNewsData_1.getNewsData)();
        const prompt = await (0, generatePrompt_1.generatePrompt)(news);
        await (0, makeOutboundCall_1.makeOutboundCall)(phoneNumber, prompt);
        res.status(200).json({
            success: true,
            message: 'Call placed successfully'
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Failed to process request',
            error: err instanceof Error ? err.message : 'Unknown error occurred'
        });
    }
});
exports.default = app;
