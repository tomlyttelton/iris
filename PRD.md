# Product Requirements Document (PRD): Iris

## 1. Product Overview

Iris is a voice-based personal research assistant designed for the MCP and A2A Hackathon. Users interact with Iris via phone calls to request research, such as gathering different viewpoints on a news story. Iris processes the query, conducts research, summarizes findings, and calls the user back with results using VAPI’s voice AI platform.

## 2. Key Features

* **Voice-Based Query Submission**: Users call Iris and verbally state their research query (e.g., “What are different viewpoints on \[news topic]?”).
* **Automated Research**: Iris performs web searches or API calls to collect information, emphasizing diverse perspectives.
* **Intelligent Summarization**: An AI model generates a concise summary of the research findings.
* **Callback with Results**: Iris initiates an outbound call to deliver the summary using a VAPI transient assistant.
* **Interactive Follow-up**: Users can ask follow-up questions during the callback, with responses based on the research data.

## 3. Technical Requirements

### 3.1 VAPI Integration

* **Inbound Calls**: Handle user queries using VAPI’s inbound call API.
* **Outbound Calls**: Use VAPI’s outbound call feature with transient assistants.
* **Transient Assistant Configuration**:

  * First message: Summary composed by an LLM.
  * System message: Full research output for answering follow-up questions.

### 3.2 Natural Language Understanding (NLU)

* Transcribe and interpret user queries using VAPI’s capabilities or an external NLU service.
* Identify the research scope, such as news analysis or general information.

### 3.3 Research Automation

* Integrate with search engines (e.g., Google Custom Search) or news APIs to gather diverse sources.
* Prioritize collecting multiple viewpoints for balanced research, especially for news topics.

### 3.4 Summarization

* Use a large language model (e.g., OpenAI API) to create concise, coherent summaries of the research findings.

## 4. Development Considerations

* **Scope**: Focus on a single query type, such as “different viewpoints on a news topic,” to ensure completion within 2 hours.
* **Simplicity**: Leverage existing APIs (VAPI, search engines, LLMs) to minimize custom development.
* **Testing**: Test with sample queries, like “What are different viewpoints on a recent news event?” to verify functionality.

## 5. Alignment with Hackathon Goals

Iris aligns with the MCP and A2A Hackathon’s emphasis on sophisticated AI agents by integrating VAPI for voice interaction, automating research with external APIs, and providing interactive, voice-based responses. Its innovative approach to hands-free research makes it a strong contender.

## 6. Workflow

1. User calls Iris’s phone number.
2. VAPI transcribes and sends the query to the system.
3. System interprets the query and conducts research using web searches or APIs.
4. System summarizes findings using an LLM.
5. System creates a transient assistant with the summary as the first message and research data in the system message.
6. VAPI initiates an outbound call to the user.
7. Assistant delivers the summary and responds to follow-up questions based on the research data.

## 7. Why Iris Stands Out

Iris offers a unique, hands-free research experience through voice interaction, delivering balanced summaries of diverse viewpoints. This is particularly valuable for users seeking unbiased information without screen-based interfaces, making it ideal for busy professionals or those on the go.

## 8. Competitive Advantage

By combining voice-based interaction with automated research and interactive follow-ups, Iris addresses the need for accessible, unbiased information retrieval. Its simplicity and focus on a niche use case (news viewpoint analysis) make it a compelling entry for the hackathon.

