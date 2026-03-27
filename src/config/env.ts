/**
 * Client-side environment (Vite embeds these at build time — not read at runtime from a .env file on the server).
 *
 * Vercel: Project → Settings → Environment Variables
 * - Names must match exactly (including the VITE_ prefix).
 * - Enable for "Production" and "Preview" as needed.
 * - Redeploy after adding or changing variables (Build must see them).
 *
 * @see https://vitejs.dev/guide/env-and-mode.html
 */

function optionalTrim(v: string | undefined): string | undefined {
  if (v === undefined || v === "") return undefined;
  const t = v.trim();
  return t === "" ? undefined : t;
}

export const env = {
  web3formsAccessKey: optionalTrim(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY),
  contentfulSpaceId: optionalTrim(import.meta.env.VITE_CONTENTFUL_SPACE_ID),
  contentfulAccessToken: optionalTrim(import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN),
} as const;

export function isWeb3FormsConfigured(): boolean {
  return Boolean(env.web3formsAccessKey);
}
