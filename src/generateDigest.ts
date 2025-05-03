import Groq from 'groq-sdk';
import { NewsArticle } from './getNewsData';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateDigest(query: string, articles: NewsArticle[]): Promise<string> {
  // Truncate articles to limit token usage
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

  try {
    const res = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768', // Or 'llama3-70b-8192'
      messages: [{ role: 'user', content: prompt }],
    });

    if (!res.choices || res.choices.length === 0) {
      throw new Error('No response from Groq');
    }

    return res.choices[0].message.content ?? 'No summary available.';
  } catch (err) {
    console.error('Groq error:', err);
    return 'Digest generation failed.';
  }
}
