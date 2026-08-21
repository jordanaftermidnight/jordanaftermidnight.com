import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", ".verify");
await mkdir(OUT, { recursive: true });

const url = "http://localhost:4321/preview2.html";
const browser = await chromium.launch();

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

console.log("→ desktop, waveform running");
await page.goto(url, { waitUntil: "networkidle" });
// Wait past the load animations so the wordmark and oscilloscope are steady
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/q1-desktop-rest.png`, fullPage: false });

console.log("→ move cursor near emblem (proximity glitch — mid-animation)");
await page.mouse.move(100, 100);
await page.waitForTimeout(150);
await page.mouse.move(720, 260); // near emblem center — triggers .is-hot
await page.waitForTimeout(100);   // capture mid-glitch (~100/450ms into animation)
await page.screenshot({ path: `${OUT}/q2a-glitch-mid.png`, fullPage: false, clip: { x: 500, y: 100, width: 500, height: 400 } });
await page.waitForTimeout(500);   // settled: full gold
await page.screenshot({ path: `${OUT}/q2b-glitch-settled.png`, fullPage: false, clip: { x: 500, y: 100, width: 500, height: 400 } });

console.log("→ hover pill");
await page.hover(".pill");
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/q3-pill-gold.png`, fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 700 } });

console.log("→ scroll + hover project");
await page.evaluate(() => document.getElementById("software").scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(500);
await page.hover(".project");
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/q4-project-hover.png`, fullPage: false });

console.log("→ fullpage");
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/q5-fullpage.png`, fullPage: true });

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mobile.newPage();
console.log("→ mobile");
await mp.goto(url, { waitUntil: "networkidle" });
await mp.waitForTimeout(2000);
await mp.screenshot({ path: `${OUT}/q6-mobile.png`, fullPage: true });

if (errors.length) {
  console.log("\n! console errors:");
  errors.forEach((e) => console.log(" •", e));
} else {
  console.log("\n✓ no console errors");
}

await browser.close();
console.log(`\nsaved to ${OUT}`);
