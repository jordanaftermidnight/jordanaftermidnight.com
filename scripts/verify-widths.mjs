// Screenshot at several viewport widths to catch mid-range layout breaks.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", ".verify");
await mkdir(OUT, { recursive: true });

const url = process.env.URL || "http://localhost:4321/";
const widths = [1440, 1024, 768, 560, 390];
const browser = await chromium.launch();

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/w${w}.png`, fullPage: false });
  console.log(`✓ w${w}.png`);
  await ctx.close();
}

await browser.close();
console.log(`saved to ${OUT}`);
