// Screenshot round-2 reference portfolios: modular / synth / hacker slice.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", ".refs");
await mkdir(OUT, { recursive: true });

const refs = [
  { slug: "7-xxiivv",    url: "https://xxiivv.com/" },
  { slug: "8-100r",      url: "https://100r.co/" },
  { slug: "9-thea",      url: "https://thea.codes/" },
  { slug: "10-winterbloom", url: "https://winterbloom.com/" },
  { slug: "11-bellard",  url: "https://bellard.org/" },
  { slug: "12-jvns",     url: "https://jvns.ca/" },
  { slug: "13-bunnie",   url: "https://www.bunniestudios.com/" },
  { slug: "14-redblob",  url: "https://www.redblobgames.com/" },
];

const browser = await chromium.launch();
try {
  await Promise.all(
    refs.map(async ({ slug, url }) => {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      try {
        console.log(`→ ${slug}  ${url}`);
        await page.goto(url, { waitUntil: "networkidle", timeout: 25000 });
        await page.waitForTimeout(2500);
        await page.screenshot({ path: `${OUT}/${slug}.png`, fullPage: false });
        console.log(`  ✓ ${slug}.png`);
      } catch (e) {
        console.log(`  ! ${slug} failed: ${e.message}`);
      } finally {
        await ctx.close();
      }
    })
  );
} finally {
  await browser.close();
}
console.log(`\nsaved to ${OUT}`);
