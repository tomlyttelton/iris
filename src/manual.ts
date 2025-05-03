import "dotenv/config";
import { generateDigest } from "./generateDigest";
import { getContext } from "./getContext";
import { makeOutboundCall } from "./makeOutboundCall";

async function main() {
  const phoneNumber = process.env.PHONE_NUMBER;
  const query = process.env.QUERY || "NPR funding cuts";

  if (!phoneNumber) {
    throw new Error("PHONE_NUMBER environment variable is required.");
  }
  const news = await getContext(query);
  console.log(news);
  const digest = await generateDigest(query, news);
  console.log(digest);
  await makeOutboundCall(phoneNumber, digest);
}

main().catch(console.error);
