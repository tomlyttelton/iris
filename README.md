# Iris (Cloud Function + MCP)

**Iris** is a serverless AI assistant that runs as a Google Cloud Function and conforms to the MCP (Modular Command Platform) interface. It handles an inbound phone number, scrapes relevant news, generates an LLM-based response, and optionally initiates an outbound phone call using Vapi.

This version exposes each logical step (news scraping, prompt generation, and call) as individual **MCP tools**, making it composable within a broader MCP workflow.

---

## 🧠 Overview

When a user calls or requests data:

1. Iris uses **Apify** to scrape real-time news headlines.
2. It uses a local **LLM prompt** to generate a spoken summary.
3. Optionally, it uses **Vapi** to make an outbound phone call with the generated message.

---

## 🌐 MCP Tools

The following HTTP POST endpoints are exposed as MCP tools:

- `POST /mcp/tools/news`  
  → Runs Apify and returns a list of news headlines.

- `POST /mcp/tools/prompt`  
  → Accepts an array of headlines and returns a voice-ready summary.

- `POST /mcp/tools/call`  
  → Accepts `{ phoneNumber, message }` and triggers an outbound call using Vapi.

Each returns `{ output: ... }` in MCP-compliant JSON.

---

## ☁️ Deploying to Google Cloud Functions

### 1. Prerequisites

- Node.js 18+ locally
- GCP project with Cloud Functions (2nd Gen) enabled
- `gcloud` CLI installed and configured

### 2. Deploy

```bash
gcloud functions deploy iris-mcp   --gen2   --runtime=nodejs20   --region=us-central1   --source=.   --entry-point=app   --trigger-http   --allow-unauthenticated
```

### 3. Test

```bash
curl -X POST https://REGION-PROJECT.cloudfunctions.net/iris-mcp/mcp/tools/news
```

---

## 🧪 Local Development

```bash
pnpm install
pnpm start
```

---

## 📁 Project Structure

```
iris-cf/
├── src/
│   ├── index.ts             # Express app with MCP routes
│   ├── getNewsData.ts       # Apify integration
│   ├── generatePrompt.ts    # LLM-friendly summarizer
│   └── makeOutboundCall.ts  # Vapi trigger
├── package.json
└── tsconfig.json
```

---

## 🔐 Environment Variables

Add a `.env` file or configure environment variables:

```env
VAPI_API_KEY=your_vapi_api_key
```

---

## 📄 License

MIT License