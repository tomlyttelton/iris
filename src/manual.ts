import 'dotenv/config';
import { makeOutboundCall } from './makeOutboundCall';
import { generateDigest } from './generateDigest';
import { getNewsData } from './getNewsData';

async function main() {
  const phoneNumber = process.env.PHONE_NUMBER;
  const query = process.env.QUERY || "Tell me what's happening in tech today";

  if (!phoneNumber) {
    throw new Error("PHONE_NUMBER environment variable is required.");
  }
  const news = await getNewsData(query);
  const digest = await generateDigest(query, news);
  // await makeOutboundCall(phoneNumber, digest);
}

main().catch(console.error);
