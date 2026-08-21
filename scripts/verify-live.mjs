// Verify the ported homepage at / — the version that'll go to jordanaftermidnight.com
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", ".verify");
await mkdir(OUT, { recursive: true });

const url = "http://localhost:4321/";
const browser = await chromium.launch();

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

console.log("→ desktop rest");
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/live1-hero.png`, fullPage: false });

console.log("→ move cursor near emblem (glitch mid)");
await page.mouse.move(100, 100);
await page.waitForTimeout(150);
await page.mouse.move(720, 260);
await page.waitForTimeout(120);
await page.screenshot({ path: `${OUT}/live2-glitch.png`, fullPage: false, clip: { x: 500, y: 100, width: 500, height: 400 } });
await page.waitForTimeout(500);

console.log("→ scroll through all sections");
await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/live3-software.png`, fullPage: false });

await page.evaluate(() => window.scrollTo({ top: 1600, behavior: "instant" }));
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/live4-hardware.png`, fullPage: false });

console.log("→ full page");
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(400);
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/live5-fullpage.png`, fullPage: true });

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mobile.newPage();
console.log("→ mobile");
await mp.goto(url, { waitUntil: "networkidle" });
await mp.waitForTimeout(2000);
await mp.screenshot({ path: `${OUT}/live6-mobile.png`, fullPage: true });

if (errors.length) {
  console.log("\n! console errors:");
  errors.forEach((e) => console.log(" •", e));
} else {
  console.log("\n✓ no console errors");
}

await browser.close();
console.log(`\nsaved to ${OUT}`);
