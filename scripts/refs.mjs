// Screenshot reference portfolios for the redesign research pass.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", ".refs");
await mkdir(OUT, { recursive: true });

const refs = [
  { slug: "1-rauno",    url: "https://rauno.me/" },
  { slug: "2-emil",     url: "https://emilkowal.ski/" },
  { slug: "3-paco",     url: "https://paco.me/" },
  { slug: "4-bruno",    url: "https://bruno-simon.com/" },
  { slug: "5-kyleboyd", url: "https://kyleboyd.design/" },
  { slug: "6-joffrey",  url: "https://joffreyspitzer.com/" },
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
        // Some sites are heavy — give them a beat to settle
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
