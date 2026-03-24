import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    role: "Full-Stack & LLM Engineer",
    company: "Copy.ai",
    period: "Oct 2024 – Feb 2026",
    current: true,
    bullets: [
      "Shipped UI, APIs, and integrations for workflows, chat, and GTM automations (content, prospecting, leads, localization).",
      "Managed production maintenance by monitoring, debugging, fixing, and rollout iteration.",
      "Built RAG with LangChain; indexed and retrieved context in vector DBs (Pinecone) for grounded, customer-specific output.",
      "Owned prompts, lightweight evals, and guardrails; kept copy on-brand and safe across segments.",
      "Ran multiple LLM APIs in production; tuned latency, cost, and fallbacks under load.",
    ],
  },
  {
    role: "Web3 Engineer",
    company: "Thorswap Finance",
    period: "Oct 2023 – Sep 2024",
    current: false,
    bullets: [
      "Contributed to SwapKit SDK for cross-chain, non-custodial swaps across 20+ networks and thousands of assets.",
      "Integrated THORChain, Chainflip, and Maya for quotes and swap routing.",
      "Delivered integrator-facing REST APIs and an SDK covering quotes, swaps, provider/token discovery, and swap status.",
      "Built transaction construction for multi-chain wallets by integrating dozens of wallet SDKs.",
      "Implemented optional pre-trade AML/KYT screening on involved addresses via multiple compliance providers.",
    ],
  },
  {
    role: "Full-Stack & Blockchain Engineer",
    company: "Flash Technologies",
    period: "Mar 2021 – Oct 2023",
    current: false,
    bullets: [
      "Delivered DeFi ecosystems: tokenization, presales, staking, launchpads, and NFT utilities.",
      "Designed and deployed smart contracts on Ethereum-compatible chains.",
      "Built Solana programs with Rust and Anchor.",
      "Coordinated third-party smart contract audits (CertiK); managed scope, fixes, and re-reviews.",
      "Integrated Slither and custom analysis pipelines.",
    ],
  },
  {
    role: "Blockchain Developer",
    company: "ICICB",
    period: "Jan 2019 – Jul 2020",
    current: false,
    bullets: [
      "Integrated dapps and services with Web3.js and Ethers.js across multiple networks.",
      "Developed a mobile wallet in React Native.",
      "Forked and customized DEX platforms for swaps, pools, and trading workflows.",
      "Built trading bots with configurable strategies and automated execution.",
      "Delivered NFT marketplaces and NFT games as end-user products.",
    ],
  },
  {
    role: "Web & Mobile Developer",
    company: "Beyond Finance",
    period: "Jan 2016 – Dec 2018",
    current: false,
    bullets: [
      "Built full-stack features for a consumer debt-resolution product (clear payoff paths, lower monthly payments, multi-year plans).",
      "Shipped Node.js (Express/Koa) REST APIs on AWS EC2; used CloudWatch for PM2/app and system logs.",
      "Configured AWS Budgets and CloudWatch alarms for spend, outages, and CPU spikes.",
      "Managed MongoDB collections and migration scripts for releases.",
      "Built landing pages and client dashboards in React and Next.js; integrated REST APIs and Redux for state.",
      "Consolidated legacy iOS/Android apps into a React Native app; published to the App Store and Google Play.",
      "Owned CI/CD, signing certs/keystores, native modules where needed, and dependency upgrades.",
    ],
  },
];

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary font-mono text-sm tracking-wider uppercase">Experience</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-foreground">
            Career <span className="gradient-text">Journey</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-0">
          {experiences.map((exp, i) => (
            <motion.div
              key={`${exp.company}-${exp.period}`}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="relative pl-8 pb-12 last:pb-0 border-l border-border group"
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-1 w-3 h-3 rounded-full -translate-x-[7px] border-2 transition-colors duration-300 ${
                  exp.current
                    ? "bg-primary border-primary box-glow"
                    : "bg-background border-muted-foreground group-hover:border-primary"
                }`}
              />

              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-500">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
                  {exp.current && (
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono border border-primary/20">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-primary font-semibold text-sm">{exp.company}</span>
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-muted-foreground text-sm font-mono">{exp.period}</span>
                </div>
                <ul className="text-muted-foreground text-sm leading-relaxed space-y-2 list-disc list-outside pl-4 marker:text-primary/60">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
