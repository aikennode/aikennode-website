import { useQuery } from "@tanstack/react-query";
import { env } from "@/config/env";
import { isContentfulConfigured } from "@/lib/contentful";
import { CONTENTFUL_PORTFOLIOS_OWNER_NAME, fetchPortfoliosFromCms } from "@/lib/contentful-portfolio";

export function usePortfolios() {
  const cacheKey = env.contentfulPortfoliosEntryId ?? CONTENTFUL_PORTFOLIOS_OWNER_NAME;

  return useQuery({
    queryKey: ["contentful", "portfolios", cacheKey],
    queryFn: () => fetchPortfoliosFromCms(),
    enabled: isContentfulConfigured(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
