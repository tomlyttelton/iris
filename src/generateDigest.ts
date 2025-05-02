import { OpenAI } from 'openai';
import { NewsArticle } from './getNewsData';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateDigest(query: string, articles: NewsArticle[]): Promise<string> {
  // Limit number of articles and truncate each article's content to reduce token usage
  const truncatedArticles = articles.slice(0, 5).map(a => {
    const safeContent = a.content.slice(0, 300).replace(/\n/g, ' ').trim();
    return `- ${a.title} - ${a.url}: "${safeContent}"`;
  });

  const prompt = `
You're a helpful assistant. The user is interested in: "${query}"

I have the following articles:
${truncatedArticles.join('\n')}

Write a short 3-sentence digest of the most relevant stories.
  `.trim();

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  if (!res.choices || res.choices.length === 0) {
    throw new Error('No response from OpenAI');
  }

  return res.choices[0].message.content ?? 'No summary available.';
}
