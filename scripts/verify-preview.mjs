// Screenshot the preview page: rest state, hover state, mobile.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", ".verify");
await mkdir(OUT, { recursive: true });

const url = process.env.URL || "http://localhost:4321/preview.html";
const browser = await chromium.launch();

// Desktop
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

console.log("→ desktop rest");
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/p1-desktop-rest.png`, fullPage: false });

console.log("→ desktop hover pill");
await page.hover(".pill");
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/p2-desktop-pill-hover.png`, fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 700 } });

console.log("→ scroll to software, hover a card");
await page.evaluate(() => document.getElementById("software").scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(400);
await page.hover(".project");
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/p3-desktop-project-hover.png`, fullPage: false });

console.log("→ full page");
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/p4-desktop-fullpage.png`, fullPage: true });

// Mobile
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mobile.newPage();
console.log("→ mobile");
await mp.goto(url, { waitUntil: "networkidle" });
await mp.waitForTimeout(1500);
await mp.screenshot({ path: `${OUT}/p5-mobile.png`, fullPage: true });

if (errors.length) {
  console.log("\n! console errors:");
  errors.forEach((e) => console.log(" •", e));
} else {
  console.log("\n✓ no console errors");
}

await browser.close();
console.log(`\nsaved to ${OUT}`);
