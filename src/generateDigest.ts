import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateDigest(headlines: string[], query: string): Promise<string> {
  const prompt = `
You're a helpful assistant. The user is interested in: "${query}"

Given these news headlines:
${headlines.map(h => `- ${h}`).join('\n')}

Write a short 3-sentence digest of the most relevant stories.
`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  return res.choices[0].message.content ?? 'No summary available.';
}
