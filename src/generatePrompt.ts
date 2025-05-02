export async function generatePrompt(articles: string[]): Promise<string> {
  return `Here's your tech news update: ${articles.join(', ')}.`;
}