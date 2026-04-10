import type { PortfolioCard } from "@/lib/contentful-portfolio";
import flashLaunchThumb from "@/assets/flash-launch.png";
import tvtFrontendThumb from "@/assets/tvt-frontend.png";
import tokenTool from "@/assets/token-tool.png";
import circularRing from "@/assets/circular-ring.png";
import aptosFamousFoxThumb from "@/assets/aptos-famous-fox.png";

export type ProjectFallbackCard = PortfolioCard & {
  link?: string;
  color?: string;
};

export const projectsFallback: ProjectFallbackCard[] = [
  {
    id: "fallback-flash-launch",
    title: "Flash Launch",
    description:
      "No-code launchpad for token creation, presales, and fair launches—with KYC and investor-focused tooling.",
    skills: ["Next.js", "TypeScript", "Node.js", "Full-stack"],
    color: "from-primary/20 to-accent/10",
    image: flashLaunchThumb.src,
    images: [tokenTool.src, aptosFamousFoxThumb.src],
    link: "https://flash-launch.com",
  },
  {
    id: "fallback-token-tool",
    title: "TokenTool.io",
    description:
      "Create and deploy fungible tokens with liquidity tooling across supported networks—fast flows and production-ready defaults.",
    skills: ["Next.js", "TypeScript", "Node.js", "Full-stack"],
    color: "from-accent/15 to-primary/20",
    image: tokenTool.src,
    link: "https://www.tokentool.io/",
  },
  {
    id: "fallback-fff-aptos",
    title: "Aptos — Famous Fox Federation",
    description:
      "Utility suite for Famous Fox Federation on Aptos—NFT mint, bulk send, peer-to-peer swap, bulk list/delist, and related NFT workflows.",
    skills: ["Next.js", "TypeScript", "Aptos", "NFT"],
    color: "from-accent/20 to-primary/10",
    image: aptosFamousFoxThumb.src,
    link: "https://aptos.famousfoxes.com/",
  },
  {
    id: "fallback-tvt",
    title: "Track Verify Trust",
    description:
      "Supply chain tracking platform enabling transparent product verification for consumers and businesses.",
    skills: ["React", "TypeScript", "Material Tailwind"],
    color: "from-accent/20 to-primary/10",
    image: tvtFrontendThumb.src,
    images: [flashLaunchThumb.src, circularRing.src],
    link: "https://tvt-front.vercel.app/",
  },
  {
    id: "fallback-circular-ring",
    title: "Circular Ring",
    description:
      "React Native mobile app—native UI and performance on iOS and Android from a single codebase.",
    skills: ["React Native", "TypeScript", "Mobile"],
    color: "from-primary/10 to-accent/20",
    image: circularRing.src,
    link: "https://play.google.com/store/apps/details?id=xyz.circular.circular&hl=en_US&pli=1",
  },
];
