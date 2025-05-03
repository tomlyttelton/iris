import { generateDigest } from "./generateDigest.js";
import { getContext } from "./getContext.js";
import { makeOutboundCall } from "./makeOutboundCall.js";

export async function research(
  name: string,
  phoneNumber: string,
  query: string
): Promise<{ success: boolean; message: string }> {
  try {
    const news = await getContext(query);
    const digest = await generateDigest(query, news);
    await makeOutboundCall(name, phoneNumber, query, digest);
    return {
      success: true,
      message: "Call placed successfully",
    };
  } catch (err) {
    console.error(err);
    throw {
      success: false,
      message: "Failed to process request",
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}
