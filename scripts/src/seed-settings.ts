import { db, siteSettingsTable } from "@workspace/db";

const DEFAULTS = [
  { key: "whatsappPhone", value: "", label: "WhatsApp Phone Number", description: "Include country code, no spaces. e.g. 14155552671" },
  { key: "whatsappMessage", value: "Hello! I'd like to learn more about Precisefect's services.", label: "WhatsApp Pre-filled Message", description: "Default message when user opens chat" },
  { key: "ga4MeasurementId", value: "", label: "GA4 Measurement ID", description: "Format: G-XXXXXXXXXX" },
  { key: "googleSearchConsoleVerification", value: "", label: "Google Search Console Verification", description: "Content value of the HTML meta tag" },
  { key: "siteUrl", value: "https://precisefect.com", label: "Canonical Site URL", description: "Used in sitemap.xml. No trailing slash." },
];

async function main() {
  console.log("Seeding site settings…");
  for (const s of DEFAULTS) {
    await db.insert(siteSettingsTable).values(s).onConflictDoNothing();
  }
  console.log("Done.");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
