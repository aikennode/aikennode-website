import { env } from "@/config/env";
import { requestContentfulGraphql } from "@/lib/contentful-graphql";

/** Parent `experiences.name` value used for this portfolio owner. */
export const CONTENTFUL_OWNER_NAME = env.contentfulOwnerName ?? "aichannode";

/** Default content type API IDs — override with `NEXT_PUBLIC_CONTENTFUL_CT_EXPERIENCES` if yours differ. */
export const CONTENT_TYPE_EXPERIENCES = "experiences";

export type ExperienceCard = {
  id: string;
  role: string;
  company: string;
  period: string;
  current: boolean;
  summary: string;
};

type GqlExperience = {
  sys: { id: string };
  role?: string | null;
  company?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  content?: string | null;
};

type GqlExperiencesCollectionData = {
  [key: string]: {
    items: Array<{
      itemsCollection?: {
        items: Array<GqlExperience | null>;
      } | null;
    }>;
  };
};

function readDateField(raw: string | null | undefined): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

function buildPeriod(startDate: Date | null, endDate: Date | null): string {
  if (!startDate && !endDate) return "—";
  if (startDate && !endDate) return `${formatMonthYear(startDate)} – Present`;
  if (!startDate && endDate) return `Until ${formatMonthYear(endDate)}`;
  return `${formatMonthYear(startDate)} – ${formatMonthYear(endDate)}`;
}

function mapExperienceItem(item: GqlExperience): ExperienceCard | null {
  const role = (item.role ?? "").trim();
  const company = (item.company ?? "").trim();
  if (!role && !company) return null;

  const startDate = readDateField(item.startDate);
  const endDate = readDateField(item.endDate);

  return {
    id: item.sys.id,
    role: role || "—",
    company: company || "—",
    period: buildPeriod(startDate, endDate),
    current: Boolean(startDate) && !endDate,
    summary: (item.content ?? "").trim(),
  };
}

function experiencesContentType(): string {
  return env.contentfulCtExperiences ?? CONTENT_TYPE_EXPERIENCES;
}

/**
 * Loads published `experiences` parent entry and resolves `items` → `experience` entries via GraphQL.
 */
export async function fetchExperiencesFromCms(): Promise<ExperienceCard[]> {
  const ctSingle = experiencesContentType();
  const ctCollection = `${experiencesContentType()}Collection`;
  const entryId = env.contentfulExperiencesEntryId;

  let rawItems: Array<GqlExperience | null> = [];

  if (entryId) {
    const queryById = `
      query ExperiencesById($entryId: String!) {
        ${ctSingle}(id: $entryId) {
          itemsCollection(limit: 50) {
            items {
              __typename
              ... on Experience {
                sys { id }
                role
                company
                startDate
                endDate
                content
              }
            }
          }
        }
      }
    `;
    const data = await requestContentfulGraphql<Record<string, { itemsCollection?: { items: Array<GqlExperience | null> } | null } | null>>(
      queryById,
      { entryId },
    );
    rawItems = data[ctSingle]?.itemsCollection?.items ?? [];
  } else {
    const queryByName = `
      query ExperiencesByOwner($ownerName: String!) {
        ${ctCollection}(limit: 1, where: { name: $ownerName }) {
          items {
            itemsCollection(limit: 50) {
              items {
                __typename
                ... on Experience {
                  sys { id }
                  role
                  company
                  startDate
                  endDate
                  content
                }
              }
            }
          }
        }
      }
    `;
    const data = await requestContentfulGraphql<GqlExperiencesCollectionData>(queryByName, {
      ownerName: CONTENTFUL_OWNER_NAME,
    });
    const collection = data[ctCollection];
    if (!collection?.items?.length) return [];
    rawItems = collection.items[0]?.itemsCollection?.items ?? [];
  }

  return rawItems
    .filter((item): item is GqlExperience => Boolean(item?.sys?.id))
    .map((item) => mapExperienceItem(item))
    .filter((item): item is ExperienceCard => Boolean(item));
}
