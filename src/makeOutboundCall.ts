import axios from 'axios';

export async function makeOutboundCall(
  phoneNumber: string,
  digest?: string
): Promise<void> {
  await axios.post(
    'https://api.vapi.ai/call',
    {
      assistantId: "4cb234b1-42dd-4284-9a48-8471edd57c06",
      phoneNumberId: "67f75bfb-0a7c-4380-9152-c55f83ac4297",
      customer: {
        number: phoneNumber,
      },
      agent: digest ? {
        variables: {
          digest: digest,
        },
      } : undefined,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
}
