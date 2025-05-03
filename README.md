# Iris Research (MCP on Cloud Run)

**Iris Research** is a stateless AI assistant hosted on **Google Cloud Run**. It accepts a phone number, scrapes real-time news using Apify, generates a voice-ready prompt using a custom LLM flow, and places an outbound call using Vapi — all through a single MCP-compatible HTTP endpoint.

---

## 🧠 Overview

This is a single MCP tool named `iris-research` that:

1. Accepts a phone number and research query.
2. Scrapes relevant news using Apify.
3. Generates a summarized spoken response using a language model.
4. Places a call to the number using Vapi and reads the result aloud.

---

## 🌐 MCP Tool

### `POST /mcp`

**Request:**

```json
{
  "jsonrpc": "2.0",
  "method": "iris-research",
  "params": {
    "phoneNumber": "+14155550123",
    "query": "latest cybersecurity news"
  },
  "id": 1
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Call placed to +14155550123 with a summary of the latest cybersecurity news."
      }
    ]
  },
  "id": 1
}
```

This endpoint is fully MCP-compatible and can be called by another MCP agent, Vapi, or any HTTP/JSON system.

---

## ☁️ Deploying to Google Cloud Run

### 1. Prerequisites

- Node.js 18+ (locally)
- GCP project with Cloud Run enabled
- Docker & `gcloud` CLI installed and authenticated

### 2. Build & Deploy

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/iris-research

gcloud run deploy iris-research \
  --image gcr.io/YOUR_PROJECT_ID/iris-research \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

> Replace `YOUR_PROJECT_ID` with your actual GCP project ID.

### 3. Test

```bash
curl -X POST https://YOUR_RUN_URL/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "iris-research",
    "params": {
      "phoneNumber": "+14155550123",
      "query": "latest AI news"
    },
    "id": 1
  }'
```

---

## 📁 Project Structure

```
iris-research/
├── src/
│   ├── index.ts             # Express server with stateless MCP endpoint
│   ├── research.ts          # Handles orchestration of scraping, prompting, and calling
│   ├── getNewsData.ts       # Apify integration
│   ├── generatePrompt.ts    # LLM prompt creation
│   └── makeOutboundCall.ts  # Vapi outbound call integration
├── package.json
├── tsconfig.json
├── Dockerfile
└── .dockerignore
```

---

## 🔐 Environment Variables

For local testing, create a `.env` file or set the following:

```env
APIFY_API_TOKEN=...
VAPI_API_KEY=...
GROQ_API_KEY=...
PHONE_NUMBER=...
```

---

## ⚙️ Tech Stack

- TypeScript
- Node.js 20+ (ESM + `.js` imports)
- MCP SDK
- Apify
- Groq or OpenAI
- Vapi
- Google Cloud Run

---

## 👥 Contributors

- Shapor Naghibzadeh
- Tom Lyttelton

---

## 📄 License

MIT License

```

```
