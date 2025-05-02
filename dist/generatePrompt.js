export async function generatePrompt(articles) {
    return `Here's your tech news update: ${articles.join(', ')}.`;
}
