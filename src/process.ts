import { getNewsData } from './getNewsData';
import { generatePrompt } from './generatePrompt';
import { makeOutboundCall } from './makeOutboundCall';
import { generateDigest } from './generateDigest';

export interface ProcessParams {
  phoneNumber: string;
  query: string;
}

export async function process({ phoneNumber, query }: ProcessParams): Promise<{ success: boolean; message: string }> {
  try {
    const news = await getNewsData(query);
    const digest = await generateDigest(query, news);
    console.log(digest);
    await makeOutboundCall(phoneNumber /*data*/);
    return {
      success: true,
      message: 'Call placed successfully'
    };
  } catch (err) {
    console.error(err);
    throw {
      success: false,
      message: 'Failed to process request',
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    };
  }
}
