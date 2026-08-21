import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", ".verify");
await mkdir(OUT, { recursive: true });

const url = "file:///Users/jordan_after_midnight/Downloads/design_handoff_copperboard/copperboard.html";
const browser = await chromium.launch();

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p1 = await desktop.newPage();
await p1.goto(url, { waitUntil: "networkidle" });
await p1.waitForTimeout(2000);
await p1.screenshot({ path: `${OUT}/cb1-hero.png`, fullPage: false });
await p1.screenshot({ path: `${OUT}/cb2-fullpage.png`, fullPage: true });

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const pm = await mobile.newPage();
await pm.goto(url, { waitUntil: "networkidle" });
await pm.waitForTimeout(2000);
await pm.screenshot({ path: `${OUT}/cb3-mobile.png`, fullPage: true });

await browser.close();
console.log("saved to", OUT);
