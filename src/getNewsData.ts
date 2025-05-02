import { ApifyClient } from 'apify-client';

export async function getNewsData(): Promise<string[]> {
  const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN!,
  });

  const { defaultDatasetId } = await client.actor('apify/website-content-crawler').call({
    startUrls: [
      { url: 'https://www.bbc.com/news' },
    ],
    pseudoUrls: [
      { purl: 'https://www.bbc.com/news[.*]' },
    ],
    linkSelector: 'a[href]',
    maxRequestsPerCrawl: 15,
    pageFunction: async () => {
      const title = document.querySelector('h1')?.innerText ?? '';
      return title ? { title, url: window.location.href } : null;
    },
  });

  const dataset = await client.dataset(defaultDatasetId).listItems();

  const headlines = Array.from(
    new Set(dataset.items.map((item: any) => item?.title).filter(Boolean))
  );

  return headlines.slice(0, 50);
}
