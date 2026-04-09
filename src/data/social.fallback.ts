import type { SocialProfile } from "@/lib/contentful-social";

/** Used when Contentful is off or returns no `social` entry. */
export const socialProfileFallback: SocialProfile = {
  id: "fallback-social",
  name: "fallback",
  fullname: "Jesus Monroig",
  role: "Full-Stack & Blockchain Engineer",
  metaDescription:
    "Jesus Monroig — Full-Stack & Blockchain Engineer specializing in EVM, Solana, and LLMs. Currently at RadCrew.",
  ogImage: "https://ibb.co/chy1bBC5",
  twitterSite: "@Lovable",
  phone: undefined,
  location: "Puerto Rico",
  email: "aikennode@gmail.com",
  linkedin: "https://www.linkedin.com/in/aichannode",
  github: "https://github.com/aichannode",
  facebook: undefined,
  twitter: undefined,
  website: undefined,
};
