import { Actor } from 'apify';

export async function getNewsData(): Promise<string[]> {
  const run = await Actor.call('apify/news-scraper', { category: 'technology' });
  return run.output?.articles?.slice(0, 3).map((a: any) => a.title) || ['No data'];
}