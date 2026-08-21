// Round 3: dev-work-forward portfolios + hardware-brand product presentation.
// The brief: how to signal "actively shipping" without a blog, and how to
// present dev work + physical hardware + music as three parallel surfaces.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", ".refs");
await mkdir(OUT, { recursive: true });

const refs = [
  // Dev work as auto-populated GitHub grids (no blog needed for aliveness)
  { slug: "15-antfu",         url: "https://antfu.me/" },
  { slug: "16-antfu-projects",url: "https://antfu.me/projects" },
  { slug: "17-leerob",        url: "https://leerob.com/" },
  { slug: "18-sindre",        url: "https://sindresorhus.com/" },
  // Hardware brand product presentation
  { slug: "19-teenage",       url: "https://teenage.engineering/" },
  { slug: "20-noise",         url: "https://www.makenoisemusic.com/" },
  // Musician-as-designer: release list without blog
  { slug: "21-nils",          url: "https://www.nilsfrahm.com/" },
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
