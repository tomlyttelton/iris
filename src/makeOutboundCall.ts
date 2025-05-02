import axios from 'axios';

export async function makeOutboundCall(
  phoneNumber: string,
): Promise<void> {
  await axios.post(
    'https://api.vapi.ai/call',
    {
      assistantId: "4cb234b1-42dd-4284-9a48-8471edd57c06",
      phoneNumberId: "fa255e3d-406c-4f95-aa9e-a6e54b2376da",
      customer: {
        number: phoneNumber,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
}
