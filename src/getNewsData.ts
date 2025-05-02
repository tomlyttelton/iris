import { Actor } from 'apify';

export async function getNewsData(): Promise<string[]> {
  await Actor.init();

  const run = await Actor.call('apify/website-content-crawler', {
    startUrls: [
      { url: 'https://www.bbc.com/news' },
      { url: 'https://edition.cnn.com/' },
      { url: 'https://www.foxnews.com/' },
    ],
    pseudoUrls: [
      { purl: 'https://www.bbc.com/news[.*]' },
      { purl: 'https://edition.cnn.com/.*' },
      { purl: 'https://www.foxnews.com/[.*]' },
    ],
    linkSelector: 'a[href]',
    maxRequestsPerCrawl: 15,
    pageFunction: async () => {
      const title = document.querySelector('h1')?.innerText ?? '';
      return title ? { title, url: window.location.href } : null;
    },
  });

  const { defaultDatasetId } = run;
  const dataset = await Actor.openDataset(defaultDatasetId);
  const items = await dataset.getData();

  await Actor.exit();

  // Clean up and return up to 5 unique headlines
  const headlines = Array.from(
    new Set(items.items.map((item: any) => item?.title).filter(Boolean))
  );

  return headlines.slice(0, 5);
}
