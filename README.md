# Iris Research (MCP Cloud Function)

**Iris Research** is a serverless AI assistant hosted on Google Cloud Functions. It accepts a phone number, scrapes real-time news using Apify, generates a spoken prompt using a custom LLM prompt, and places an outbound call using Vapi to relay the result — all through a single MCP-compatible endpoint.

---

## 🧠 Overview

This is a single MCP tool named `iris-research` that:

1. Accepts a phone number as input.
2. Scrapes technology news headlines using Apify.
3. Generates a voice-ready summary using a language model.
4. Calls the user back with the generated message using Vapi.

---

## 🌐 MCP Tool

### `POST /mcp/tools/iris-research`

**Request:**

```json
{
  "phoneNumber": "+14155550123"
}
```

**Response:**

```json
{
  "output": "Call placed"
}
```

This endpoint can be called by Vapi, another MCP agent, or any system that speaks HTTP and JSON.

---

## ☁️ Deploying to Google Cloud Functions

### 1. Prerequisites

- Node.js 18+
- GCP project with Cloud Functions (2nd Gen) enabled
- `gcloud` CLI installed and configured

### 2. Deploy

```bash
gcloud functions deploy iris-research   --gen2   --runtime=nodejs20   --region=us-central1   --source=.   --entry-point=app   --trigger-http   --allow-unauthenticated
```

### 3. Test

```bash
curl -X POST https://REGION-PROJECT.cloudfunctions.net/iris-research/mcp/tools/iris-research   -H "Content-Type: application/json"   -d '{"phoneNumber": "+14155550123"}'
```

---

## 📁 Project Structure

```
iris-research/
├── src/
│   ├── index.ts             # Main handler with single MCP tool
│   ├── getNewsData.ts       # Apify integration
│   ├── generatePrompt.ts    # Prompt generator
│   └── makeOutboundCall.ts  # Vapi call trigger
├── package.json
└── tsconfig.json
```

---

## 🔐 Environment Variables

For testing locally create a `.env` file or configure the following:

```env
APIFY_API_TOKEN=...
VAPI_API_KEY=...
GROQ_API_KEY=...
PHONE_NUMBER=...
```

---

## 👥 Contributors

- Tom Lyttelton – Creator & Engineer
- Shapor Naghibzadeh

---

## 📄 License

MIT License
