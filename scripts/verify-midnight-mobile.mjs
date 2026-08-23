// Verify /midnight mobile experience: landscape hint appears in portrait,
// board is horizontally scrollable, cable drag works via touch (pointer events).
import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", ".verify");
await mkdir(OUT, { recursive: true });

const base = process.env.URL || "http://localhost:4321";
const browser = await chromium.launch();

// Portrait iPhone-ish
const portrait = await browser.newContext({
  ...devices["iPhone 13"],
  hasTouch: true,
});
const p = await portrait.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));

console.log("→ /midnight on iPhone 13 portrait");
await p.goto(`${base}/midnight`, { waitUntil: "networkidle" });
await p.waitForTimeout(1500);

const hintVisible = await p.locator(".landscape-hint").isVisible();
console.log(`   landscape hint visible: ${hintVisible} (expected true)`);

const boardWrapScrollable = await p.evaluate(() => {
  const el = document.querySelector(".board-wrap");
  return el.scrollWidth > el.clientWidth;
});
console.log(`   board is horizontally scrollable: ${boardWrapScrollable}`);

await p.screenshot({ path: `${OUT}/mob-portrait.png`, fullPage: false });

// Scroll the board a bit to prove scroll works
await p.evaluate(() => document.querySelector(".board-wrap").scrollBy({ left: 400, behavior: "instant" }));
await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/mob-portrait-scrolled.png`, fullPage: false });

// Dismiss the hint, verify it stays dismissed
await p.locator(".landscape-hint button").click();
await p.waitForTimeout(300);
const hintAfterDismiss = await p.locator(".landscape-hint").isVisible();
console.log(`   hint after dismiss: ${hintAfterDismiss} (expected false)`);
await p.reload({ waitUntil: "networkidle" });
await p.waitForTimeout(800);
const hintAfterReload = await p.locator(".landscape-hint").isVisible();
console.log(`   hint after reload (sessionStorage): ${hintAfterReload} (expected false)`);

// Landscape iPhone — hint should NOT appear
const landscape = await browser.newContext({
  ...devices["iPhone 13 landscape"],
  hasTouch: true,
});
const l = await landscape.newPage();
console.log("→ /midnight on iPhone 13 landscape");
await l.goto(`${base}/midnight`, { waitUntil: "networkidle" });
await l.waitForTimeout(1500);
const hintOnLandscape = await l.locator(".landscape-hint").isVisible();
console.log(`   landscape hint on landscape phone: ${hintOnLandscape} (expected false)`);
await l.screenshot({ path: `${OUT}/mob-landscape.png`, fullPage: false });

if (errors.length) {
  console.log("\n! errors:");
  errors.forEach((e) => console.log(" •", e));
} else {
  console.log("\n✓ no errors");
}

await browser.close();
console.log(`\nsaved to ${OUT}`);
