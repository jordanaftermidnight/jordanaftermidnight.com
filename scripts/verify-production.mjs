// Final smoke test against the live production URL.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", ".verify");
await mkdir(OUT, { recursive: true });

const url = "https://jordanaftermidnight.com/";
const browser = await chromium.launch();
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

console.log(`→ ${url} (production)`);
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/prod1-hero.png`, fullPage: false });
await page.screenshot({ path: `${OUT}/prod2-full.png`, fullPage: true });

// Sample a project link — click through to confirm hotlink works
await page.mouse.move(720, 260);  // trigger emblem glitch en route
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/prod3-glitch.png`, fullPage: false, clip: { x: 500, y: 100, width: 500, height: 400 } });

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mobile.newPage();
console.log("→ mobile");
await mp.goto(url, { waitUntil: "networkidle" });
await mp.waitForTimeout(2500);
await mp.screenshot({ path: `${OUT}/prod4-mobile.png`, fullPage: true });

if (errors.length) {
  console.log("\n! console errors:");
  errors.forEach((e) => console.log(" •", e));
} else {
  console.log("\n✓ no console errors on production");
}

await browser.close();
console.log(`\nsaved to ${OUT}`);
