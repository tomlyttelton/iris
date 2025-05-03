/**
 * Research module for processing user queries and making outbound calls.
 * This module coordinates the research process by gathering context, generating digests,
 * and initiating outbound calls.
 */

import { generateDigest } from "./generateDigest.js";
import { getContext } from "./getContext.js";
import { makeOutboundCall } from "./makeOutboundCall.js";

/**
 * Processes a research query by gathering context, generating a digest, and making an outbound call.
 * @param {string} name - Name of the recipient
 * @param {string} phoneNumber - Recipient's phone number in E.164 format
 * @param {string} query - User's research query or topic
 * @returns {Promise<{success: boolean, message: string}>} Result of the research process
 * @throws {Error} If any step in the research process fails
 */
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
