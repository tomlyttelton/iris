# Iris

**Iris** is a TypeScript-based AI voice assistant that interacts via phone calls. It receives inbound calls through [Vapi](https://vapi.ai), orchestrates an intelligent workflow using [Temporal](https://temporal.io), scrapes real-time data using [Apify](https://apify.com/), generates an LLM-powered response, and initiates an outbound call to deliver the result.

---

## 🧠 Overview

When someone calls Iris, the system:

1. **Accepts the call** using Vapi's API.
2. **Starts a Temporal workflow** to manage state and execution.
3. **Runs Apify agents** to scrape the latest news or context.
4. **Generates a response** via LLM using the gathered data.
5. **Calls the user back** with the generated spoken reply.

---

## 🛠️ Tech Stack

| Component         | Technology                    |
|------------------|-------------------------------|
| Orchestration    | Temporal TypeScript SDK       |
| Voice interface  | Vapi                          |
| Scraping agents  | Apify SDK                     |
| Response logic   | Custom LLM prompts            |
| Runtime          | Node.js + TypeScript          |
| Hosting (future) | Google Cloud Run (or similar) |

---

## 📁 Project Structure

```
iris/
├── workflows/
│   └── irisWorkflow.ts         # Temporal workflow definition
├── activities/
│   ├── getNewsData.ts          # Runs Apify scraping agents
│   ├── generatePrompt.ts       # Creates LLM-ready prompt
│   └── makeOutboundCall.ts     # Uses Vapi to call the user
├── worker.ts                   # Temporal worker registration
├── client.ts                   # Starts workflows
├── utils/
│   └── apifyClient.ts          # Helper for Apify interaction
├── vapi/
│   └── handler.ts              # Express handler for Vapi webhooks
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started (Local Dev)

### Prerequisites

- Node.js 18+
- `npm` or `pnpm`
- [Temporal CLI](https://docs.temporal.io/typescript/introduction/)
- [Vapi API key](https://docs.vapi.ai/)
- [Apify API token](https://docs.apify.com/sdk/js/)

### Installation

```bash
git clone https://github.com/yourusername/iris
cd iris
pnpm install
```

### Start Temporal Dev Server

```bash
npx temporalite start
```

### Run the Worker

```bash
pnpm start:worker
```

### Trigger a Workflow

```bash
pnpm start:client --phone="+1234567890"
```

---

## 🤖 AI Context Prompt (for model input)

> You are Iris, a voice-based AI assistant. When a user calls, you run a workflow that gathers up-to-date information using Apify agents, summarizes key findings using an LLM prompt, and calls the user back via Vapi with a spoken summary. You aim to be concise, timely, and engaging when delivering information. Responses must be well-suited for phone-based voice output.

---

## 🧪 Example Use Case

1. User calls Iris via a Vapi webhook.
2. Iris launches a workflow.
3. Apify scrapes today's headlines.
4. A prompt is created: “Give me a short, spoken news roundup for a tech-savvy listener.”
5. Iris calls the user back and reads the AI-generated content.

---

## 🔮 Roadmap

- [ ] Complete core workflow with scraping + call back
- [ ] Add conversational context support (multi-turn)
- [ ] Improve LLM prompt design + voice formatting
- [ ] Cloud deployment + persistent workers

---

## 👥 Contributors

- Tom Lyttelton – Creator & Engineer

---

## 📄 License

MIT License
