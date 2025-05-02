"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsData = getNewsData;
const apify_1 = require("apify");
async function getNewsData() {
    const run = await apify_1.Actor.call('apify/news-scraper', { category: 'technology' });
    return ['No data']; //run.output?.articles?.slice(0, 3).map((a: any) => a.title) || ['No data'];
}
