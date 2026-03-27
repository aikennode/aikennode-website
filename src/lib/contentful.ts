import { createClient, type EntriesQueries } from "contentful";
import { env } from "@/config/env";

/** True when Delivery API credentials are present (see `.env.example` / Vercel env). */
export function isContentfulConfigured(): boolean {
  return Boolean(env.contentfulSpaceId && env.contentfulAccessToken);
}

/**
 * Content Delivery API client (published content only).
 * Use a Content Preview API token + `host: 'preview.contentful.com'` only from a server if you need drafts.
 */
export function getContentfulClient() {
  if (!isContentfulConfigured()) {
    throw new Error(
      "Contentful is not configured. Set VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN locally or in Vercel (see .env.example).",
    );
  }
  return createClient({
    space: env.contentfulSpaceId!,
    accessToken: env.contentfulAccessToken!,
  });
}

export type FetchEntriesParams = Omit<EntriesQueries, "content_type"> & {
  /** Content type ID from Contentful (e.g. `blogPost`). */
  contentType: string;
};

/**
 * Fetch entries for a single content type.
 * @example
 * const { items, total } = await fetchEntries({ contentType: "blogPost", limit: 10, order: "-fields.publishedDate" });
 */
export async function fetchEntries(params: FetchEntriesParams) {
  const { contentType, ...query } = params;
  const client = getContentfulClient();
  return client.getEntries({
    content_type: contentType,
    ...query,
  });
}

/**
 * Fetch a single entry by ID.
 */
export async function fetchEntryById(entryId: string) {
  const client = getContentfulClient();
  return client.getEntry(entryId);
}
