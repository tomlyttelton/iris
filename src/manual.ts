import { getNewsData } from './getNewsData';
import { generatePrompt } from './generatePrompt';
import 'dotenv/config';

async function main() {
  const phoneNumber = process.env.PHONE_NUMBER;
  const query = process.env.QUERY || "Tell me what's happening in tech today";

  if (!phoneNumber) {
    throw new Error("PHONE_NUMBER environment variable is required.");
  }

  console.log("Fetching news...");
  const news = await getNewsData();
  console.log("Generating prompt...");
  const prompt = await generatePrompt(news);
  console.log("Prompt generated:", prompt);
}

main().catch(console.error);
