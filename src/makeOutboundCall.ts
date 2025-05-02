import axios from 'axios';

export async function makeOutboundCall(phoneNumber: string, message: string): Promise<void> {
  await axios.post('https://api.vapi.ai/call', {
    to: phoneNumber,
    text: message,
    voice: 'en-US-Wavenet-D'
  }, {
    headers: {
      Authorization: `Bearer ${process.env.VAPI_API_KEY}`
    }
  });
}