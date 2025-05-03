# Product Requirements Document (PRD): Iris

## 1. Product Overview

Iris is a voice-based personal research assistant designed for the [MCP and A2A Hackathon](https://mcp-and-a2a-hackathon.devpost.com/). The hackathon challenges participants to build multimodal AI agents capable of advanced reasoning and autonomous decision-making. Iris supports two modes of interaction:

- **Inbound**: Users call a dedicated Vapi number. Vapi transcribes the query and forwards it via MCP to Iris, which responds with a voice-ready answer.
- **Outbound**: An MCP-compatible request is sent to Iris with a phone number and research query. Iris gathers the information and initiates a callback to the user via Vapi.

In both flows, Iris processes the query, conducts research using real-time news data, summarizes findings using LLMs, and delivers results by voice through Vapi.

## 2. Key Features

- **Voice-Based Query Submission (Inbound)**: Users call Iris, Vapi transcribes the audio and forwards the structured query.
- **Programmatic Query Submission (Outbound)**: MCP agents can call Iris via HTTP with a phone number and query.
- **Automated Research**: Iris performs web scraping and API calls (e.g., Apify) to gather diverse viewpoints.
- **Intelligent Summarization**: A language model creates a concise, coherent summary.
- **Voice Delivery via Vapi**:

  - Inbound: response is read back in-call.
  - Outbound: Iris initiates a call with a Vapi transient assistant.

## 3. Technical Requirements

### 3.1 VAPI Integration

- **Inbound Calls**: Vapi transcribes the user query and sends a structured MCP request to Iris.
- **Outbound Calls**: Iris sends a request to Vapi's outbound API, using a transient assistant.
- **Transient Assistant Configuration**:

  - **First Message**: Summary composed by an LLM.
  - **System Message**: Full research output, available for answering follow-ups.

### 3.2 Natural Language Understanding (NLU)

- Transcription and interpretation of voice via Vapi.
- Identification of research intent and query scope.

### 3.3 Research Automation

- Integration with news APIs or search scrapers (e.g., Apify).
- Prioritization of multiple viewpoints for balance.

### 3.4 Summarization

- Usage of LLMs (e.g., Groq/OpenAI) for concise spoken summaries.

### 3.5 Vendor Pricing

- **VAPI**: Offers \$1,000 in startup credits and access to their program.
- **Apify**: Pricing based on actor runs; many community actors are free for light usage.
- **Groq/OpenAI**: Based on token volume; GPT-4 or Groq mix depending on use.

## 4. Development Considerations

- **Scope**: Focused on single-turn queries like "What are different viewpoints on X?"
- **Simplicity**: Reuse mature APIs to minimize custom development.
- **Testing**: Use static test queries and mock voice calls.

## 5. Alignment with Hackathon Goals

Iris demonstrates the power of MCP as an integration layer and A2A as a voice interface. It combines multiple sponsor tools and fulfills the multimodal AI agent concept by:

- Understanding voice input
- Performing real-time web research
- Generating synthesized responses
- Delivering results via voice

## 6. Workflow

### Inbound Voice Flow:

1. User calls Iris via Vapi number.
2. Vapi transcribes the voice input.
3. Vapi sends an MCP request to `/mcp`.
4. Iris processes the query, gathers and summarizes information.
5. Iris responds via MCP.
6. Vapi reads the response aloud to the user.

### Outbound Voice Flow:

1. An HTTP MCP request is made to Iris with a query and phone number.
2. Iris gathers and summarizes the information.
3. Iris configures a Vapi transient assistant.
4. Iris uses the Vapi API to place a call.
5. The assistant reads the summary aloud to the recipient.

## 7. Why Iris Stands Out

Iris provides a screen-free, hands-free research experience — ideal for professionals, drivers, or accessibility users. Its use of voice-first delivery, backed by structured APIs and real-time data, makes it uniquely practical.

## 8. Competitive Advantage

By combining:

- **Voice-first UX**
- **Autonomous agent orchestration via MCP**
- **Balanced news and viewpoint analysis**
- **LLM-driven summarization**

Iris is a compelling entry in the hackathon, showcasing the interoperability and modularity of AI agents working together.
