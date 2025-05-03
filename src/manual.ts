import "dotenv/config";

async function main() {
  const phoneNumber = process.env.PHONE_NUMBER;
  const query = process.env.QUERY || "NPR funding cuts";

  if (!phoneNumber) {
    throw new Error("PHONE_NUMBER environment variable is required.");
  }
  // const news = await getContext(query);
  // console.log(news);
  // const digest = await generateDigest(query, news);
  // console.log(digest);
  await makeOutboundCall(phoneNumber);
}

main().catch(console.error);
