import Groq from "groq-sdk";
import { WebSource as WebPage } from "./getContext.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateDigest(
  query: string,
  articles: WebPage[]
): Promise<string> {
  // Truncate articles to limit token usage
  const truncatedArticles = articles.slice(0, 5).map((a) => {
    const safeContent = a.content.slice(0, 300).replace(/\n/g, " ").trim();
    return `- ${a.title} - ${a.url}: "${safeContent}"`;
  });

  const prompt = `
  You're a helpful assistant. The user is interested in: "${query}"

  Below are recent summaries of webpages related to this topic. Write a clear, well-organized digest that:
  - Informs the user about the current status and developments
  - Describes key individuals, actions, or events involved
  - Highlights differing viewpoints where relevant
  - Notes any legal, political, or financial implications
  - Synthesizes overlapping content without repetition
  - Maintains a neutral and informative tone throughout
  - Outputs only the final digest — do not include internal thoughts or reasoning

  Keep the response under 1000 words.

  Webpages:
  ---
  ${truncatedArticles.join("\n")}
  ---
  `.trim();

  try {
    const res = await groq.chat.completions.create({
      model: "deepseek-r1-distill-llama-70b",
      messages: [{ role: "user", content: prompt }],
    });

    if (!res.choices || res.choices.length === 0) {
      throw new Error("No response from Groq");
    }

    return (
      res.choices[0].message.content
        ?.replace(/<think>[\s\S]*?<\/think>\s*/i, "")
        .trim() ?? "No summary available."
    );
  } catch (err) {
    console.error("Groq error:", err);
    return "Digest generation failed.";
  }
}
