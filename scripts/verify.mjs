// Smoke-verify the site: navigate, capture rest + hover + project-hover states,
// dump console errors. Not a test framework — just eyes on the pixel result.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", ".verify");
await mkdir(OUT, { recursive: true });

const url = process.env.URL || "http://localhost:4321";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

console.log(`→ navigating ${url}`);
await page.goto(url, { waitUntil: "networkidle" });

// Give scramble animations + font-swap time to settle
await page.waitForTimeout(1500);

console.log("→ screenshot: hero at rest");
await page.screenshot({ path: `${OUT}/1-hero-rest.png`, fullPage: false });

console.log("→ hover nav lockup");
await page.hover(".brand-lockup");
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/2-nav-hover.png`, fullPage: false, clip: { x: 0, y: 0, width: 700, height: 100 } });

console.log("→ move cursor near hero emblem center");
await page.mouse.move(720, 450);
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/3-hero-emblem-hot.png`, fullPage: false });

console.log("→ scroll to projects, hover a card");
await page.evaluate(() => document.getElementById("projects")?.scrollIntoView({ behavior: "instant", block: "start" }));
await page.waitForTimeout(500);
const firstCard = page.locator(".project-card").first();
await firstCard.scrollIntoViewIfNeeded();
await firstCard.hover();
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/4-project-card-hover.png`, fullPage: false });

console.log("→ full page screenshot");
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/5-full-page.png`, fullPage: true });

if (consoleErrors.length) {
  console.log("\n! console errors:");
  consoleErrors.forEach((e) => console.log("  •", e));
} else {
  console.log("\n✓ no console errors");
}

await browser.close();
console.log(`\nscreenshots saved to ${OUT}`);
