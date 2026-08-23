// Verify /midnight page renders + emblem×5 unlock works from /.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", ".verify");
await mkdir(OUT, { recursive: true });

const base = process.env.URL || "http://localhost:4321";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

// 1. /midnight direct visit
console.log("→ /midnight direct");
await page.goto(`${base}/midnight`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/mid1-page.png`, fullPage: true });

// Verify all 8 modules rendered
const moduleCount = await page.locator(".mod").count();
console.log(`   modules rendered: ${moduleCount} (expected 8)`);

// Verify cables SVG has 5 initial cables
const cableCount = await page.locator("#cablesvg path.cable").count();
console.log(`   default cables: ${cableCount} (expected 5)`);

// 2. Emblem×5 unlock from home
console.log("→ / emblem×5 unlock");
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

// Click emblem 5 times rapidly
for (let i = 1; i <= 5; i++) {
  await page.locator("#hero-emblem").click({ delay: 50 });
  await page.waitForTimeout(200);
}
await page.waitForTimeout(1000);
const urlAfter = page.url();
console.log(`   url after 5 clicks: ${urlAfter}`);
console.log(`   ${urlAfter.endsWith("/midnight") || urlAfter.endsWith("/midnight/") ? "✓" : "✗"} unlock worked`);

// 3. Simulate after-midnight: set clock hour to 2am and reload
console.log("→ / with clock forced to 02:00");
await page.goto(`${base}/`, { waitUntil: "networkidle" });
// Override Date.getHours() BEFORE the Footer's script runs — need to
// inject via addInitScript then reload
await page.addInitScript(() => {
  const origGet = Date.prototype.getHours;
  Date.prototype.getHours = function () {
    return 2; // pretend it's 2am
  };
});
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const hintVisible = await page.locator(".foot .late").isVisible();
console.log(`   late-night hint visible: ${hintVisible} (expected true)`);
await page.evaluate(() => document.querySelector("footer").scrollIntoView());
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/mid2-late-hint.png`, clip: { x: 0, y: 300, width: 1440, height: 300 } });

if (errors.length) {
  console.log("\n! console errors:");
  errors.forEach((e) => console.log(" •", e));
} else {
  console.log("\n✓ no console errors");
}

await browser.close();
console.log(`\nsaved to ${OUT}`);
