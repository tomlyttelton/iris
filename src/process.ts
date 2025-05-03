import { generateDigest } from "./generateDigest";
import { getContext } from "./getContext";
import { makeOutboundCall } from "./makeOutboundCall";

export interface ProcessParams {
  phoneNumber: string;
  query: string;
}

export async function process({
  phoneNumber,
  query,
}: ProcessParams): Promise<{ success: boolean; message: string }> {
  try {
    const news = await getContext(query);
    const digest = await generateDigest(query, news);
    await makeOutboundCall(phoneNumber, digest);
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
