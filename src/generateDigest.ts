import { OpenAI } from 'openai';
import { NewsArticle } from './getNewsData';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateDigest(query: string, articles: NewsArticle[]): Promise<string> {
  const prompt = `
You're a helpful assistant. The user is interested in: "${query}"

I have the following articles:
${articles.map(a => `- ${a.title} - ${a.url}: "${a.content}"`).join('\n')}

Write a short 3-sentence digest of the most relevant stories.
`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  return res.choices[0].message.content ?? 'No summary available.';
}
