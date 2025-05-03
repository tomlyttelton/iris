import { ApifyClient } from "apify-client";

export interface WebSource {
  title: string;
  url: string;
  content: string;
}

export async function getContext(query: string): Promise<WebSource[]> {
  const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN!,
  });

  // Step 1: Use Google Search
  const { defaultDatasetId: searchDatasetId } = await client
    .actor("apify/google-search-scraper")
    .call({
      queries: query,
      resultsPerPage: 10,
      maxPagesPerQuery: 1,
    });

  const searchResults = await client.dataset(searchDatasetId).listItems();
  const startUrls = searchResults.items
    .flatMap((item: any) => item.organicResults || [])
    .map((result: any) => ({ url: result.url }))
    .filter((item) => typeof item.url === "string")
    .slice(0, 10);

  // Step 2: Scrape articles
  const { defaultDatasetId: datasetId } = await client
    .actor("apify/cheerio-scraper")
    .call({
      startUrls,
      maxConcurrency: 10,
      pageFunction: `
      async function ({ request, $ }) {
        const h1 = $('h1').first().text().trim();
        const titleTag = $('title').text().trim();
        const title = h1 || titleTag || null;

        const articleSelectors = [
          'article',
          '[class*="article"]',
          '[class*="content"]',
          '[class*="story"]',
          '[id*="article"]',
          '[id*="content"]',
          '[id*="story"]'
        ];

        let content = '';
        for (const selector of articleSelectors) {
          const el = $(selector).first();
          if (el && el.text().trim().length > 200) {
            content = el.text().trim();
            break;
          }
        }

        if (!content) {
          content = $('p')
            .slice(0, 5)
            .map((_, el) => $(el).text())
            .get()
            .join('\\n')
            .trim();
        }

        return title && content
          ? { title, url: request.url, content }
          : null;
      }
    `,
    });

  const { items } = await client.dataset(datasetId).listItems();

  const sources: WebSource[] = items
    .filter(
      (item: any): item is WebSource =>
        typeof item?.title === "string" &&
        typeof item?.url === "string" &&
        typeof item?.content === "string"
    )
    .reduce<WebSource[]>((acc, source) => {
      const webSource = source as unknown as WebSource;
      if (!acc.find((a) => a.title === webSource.title)) {
        acc.push(webSource);
      }
      return acc;
    }, [])
    .slice(0, 50);

  return sources;
}
