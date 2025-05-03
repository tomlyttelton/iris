import axios from "axios";

export async function makeOutboundCall(
  name: string,
  phoneNumber: string,
  query: string,
  digest: string
): Promise<void> {
  const payload = {
    assistantId: "81d8bd23-7b54-4473-8767-12f8f2fc9e63",
    phoneNumberId: "67f75bfb-0a7c-4380-9152-c55f83ac4297",
    customer: {
      number: phoneNumber,
    },
    assistantOverrides: {
      firstMessage: `Hey ${name}, I'm calling to give you the latest on ${query}. Want to hear it?`,
      model: {
        provider: "openai",
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: `You are Iris, an assistant designed to help the user make sense of complex topics by offering a sounding board to chat with diverse opinions.

YOU SHOULD RESPOND WITH ONE OR TWO SENTENCES AT A TIME

RESPOND IN A CONVERSATIONAL MANNER!
KEEP YOUR RESPONSES SHORT AND CONVERSATIONAL ALLOWING THE USER TO ASK FOLLOW UP QUESTIONS

First give an overview of the findings below, then allow the user to ask questions

${digest}`,
          },
        ],
      },
    },
  };

  try {
    await axios.post("https://api.vapi.ai/call", payload, {
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const err = error as any;
    console.error("Vapi API error:", err.response?.data || err.message);
    throw err;
  }
}
