import { ApifyClient } from 'apify-client';

export async function getNewsData(query = 'latest news'): Promise<string[]> {
  const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN!,
  });

  // Step 1: Google Search
  const { defaultDatasetId: searchDatasetId } = await client.actor('apify/google-search-scraper').call({
    queries: query,
    resultsPerPage: 10,
    maxPagesPerQuery: 1,
  });

  const searchResults = await client.dataset(searchDatasetId).listItems();
  const startUrls = searchResults.items
    .map((item: any) => ({ url: item.url }))
    .filter(Boolean)
    .slice(0, 10);

  // Step 2: Scrape each result page individually, no crawling
  const { defaultDatasetId: datasetId } = await client.actor('apify/cheerio-scraper').call({
    startUrls,
    maxConcurrency: 10,
    pageFunction: `
      async function ({ request, $ }) {
        const h1 = $('h1').first().text().trim();
        const titleTag = $('title').text().trim();
        const title = h1 || titleTag || null;
        return title ? { title, url: request.url } : null;
      }
    `,
  });

  const { items } = await client.dataset(datasetId).listItems();

  const headlines = Array.from(
    new Set(items.map((item: any) => item?.title).filter(Boolean))
  );

  return headlines.slice(0, 50);
}
