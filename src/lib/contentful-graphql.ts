import { env } from "@/config/env";
import { isContentfulConfigured } from "@/lib/contentful";

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

function contentfulGraphqlUrl(): string {
  return `https://graphql.contentful.com/content/v1/spaces/${env.contentfulSpaceId}`;
}

function assertConfigured() {
  if (!isContentfulConfigured()) {
    throw new Error(
      "Contentful is not configured. Set NEXT_PUBLIC_CONTENTFUL_SPACE_ID and NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN locally or in Vercel (see .env.example).",
    );
  }
}

/** Run a GraphQL query against Contentful Content Delivery API. */
export async function requestContentfulGraphql<TData>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<TData> {
  assertConfigured();

  const response = await fetch(contentfulGraphqlUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.contentfulAccessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Contentful GraphQL request failed (${response.status}).`);
  }

  const payload = (await response.json()) as GraphQlResponse<TData>;
  if (payload.errors?.length) {
    const message = payload.errors[0]?.message ?? "Unknown GraphQL error";
    throw new Error(`Contentful GraphQL error: ${message}`);
  }

  if (!payload.data) {
    throw new Error("Contentful GraphQL returned no data.");
  }

  return payload.data;
}
