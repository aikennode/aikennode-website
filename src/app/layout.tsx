import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import "./globals.css";

const themeInit = `
(function () {
  try {
    var t = localStorage.getItem("theme");
    var theme = t === "light" || t === "dark" ? t : "dark";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  } catch (e) { }
})();
`;

/** Same as legacy Vite `index.html` viewport — avoids default / device-specific text scaling drift */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Jesus Monroig | Blockchain & Blockchain Engineer",
  description:
    "Jesus Monroig — Fullstack & Blockchain Engineer specializing in EVM, Solana, and LLMs. Currently at RadCrew.",
  authors: [{ name: "Jesus Monroig" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Jesus Monroig | Fullstack & Blockchain Engineer",
    description:
      "Jesus Monroig — Fullstack & Blockchain Engineer specializing in EVM, Solana, and LLMs. Currently at RadCrew.",
    type: "website",
    images: ["https://ibb.co/chy1bBC5"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Lovable",
    title: "Jesus Monroig | Fullstack & Blockchain Engineer",
    description:
      "Jesus Monroig — Fullstack & Blockchain Engineer specializing in EVM, Solana, and LLMs. Currently at RadCrew.",
    images: ["https://ibb.co/chy1bBC5"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="m-0 bg-background font-body text-foreground antialiased"
        suppressHydrationWarning
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
