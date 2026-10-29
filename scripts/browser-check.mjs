import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--enable-webgl",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:3000");
await page.getByRole("button", { name: "Play the crossing" }).waitFor();
await page.screenshot({ path: "test-results/desktop.png" });
assert.equal(await page.getByRole("link", { name: "Emman home" }).count(), 1);
await page.getByRole("button", { name: "Switch to dark mode" }).click();
await page.waitForFunction(
  () => document.querySelector(".scene-host")?.dataset.theme === "dark",
);
await page.screenshot({ path: "test-results/desktop-night.png" });
await page.getByRole("button", { name: "Switch to light mode" }).click();
await page.evaluate(() => window.scrollTo({ top: 4800, behavior: "instant" }));
await page.waitForTimeout(900);
assert.equal(
  Number(await page.locator(".scene-host").getAttribute("data-row")),
  Math.round((await page.evaluate(() => scrollY)) / 120),
);
assert.equal(
  Number(await page.locator(".scene-host").getAttribute("data-lanes")),
  49,
);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(800);
assert.equal(await page.locator(".scene-host").getAttribute("data-row"), "0");

await page.getByRole("button", { name: "Simple", exact: true }).click();
await page.waitForFunction(() => !document.querySelector("canvas"));
await page.reload();
await page.waitForTimeout(700);
assert.equal(await page.locator("canvas").count(), 0);
await page.getByRole("button", { name: "Explore", exact: true }).click();
await page.getByRole("button", { name: "Play the crossing" }).waitFor();
await page.evaluate(() => scrollTo(0, 650));
await page.waitForTimeout(400);
const pos = await page.evaluate(() => scrollY);
await page.getByRole("button", { name: "Play the crossing" }).click();
assert.equal(
  await page.locator(".scene-host").getAttribute("data-signs"),
  "hidden",
);
await page.getByRole("button", { name: "Switch to dark mode" }).click();
await page.waitForFunction(
  () => document.querySelector(".scene-host")?.dataset.theme === "dark",
);
assert.equal(
  await page.locator(".game-ui").evaluate((el) => getComputedStyle(el).color),
  "rgb(225, 234, 217)",
);
await page.screenshot({ path: "test-results/game-night.png" });
await page.getByRole("button", { name: "Let’s hop" }).click();
await page.keyboard.press("ArrowUp");
await page.waitForTimeout(250);
await page.getByRole("button", { name: "Pause", exact: true }).click();
await page.getByRole("heading", { name: "Take a breath." }).waitFor();
await page.getByRole("button", { name: "Keep going" }).click();
await page.keyboard.press("ArrowUp");
await page
  .getByRole("heading", { name: "A little road bump." })
  .waitFor({ timeout: 20000 });
await page.getByRole("button", { name: "Try again" }).click();
await page.getByRole("button", { name: "Pause", exact: true }).click();
await page.getByRole("heading", { name: "Take a breath." }).waitFor();
await page.getByRole("button", { name: "Exit game" }).click();
assert.ok(Math.abs((await page.evaluate(() => scrollY)) - pos) < 5);
await page.waitForFunction(()=>document.querySelector(".scene-host")?.dataset.signs === "visible");
await page.goto("http://localhost:3000/projects/dars/");
await page.getByRole("heading", { name: "DARS", exact: true }).waitFor();
await page.getByRole("button", { name: "Switch to light mode" }).waitFor();
assert.equal(await page.locator(".detail-images img").count(), 3);
await page.close();
const simple = await browser.newPage({
  reducedMotion: "reduce",
  viewport: { width: 390, height: 844 },
});
await simple.goto("http://localhost:3000", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await simple.waitForTimeout(600);
assert.equal(await simple.locator("canvas").count(), 0);
assert.equal(
  await simple.evaluate(
    () => document.documentElement.scrollWidth <= innerWidth,
  ),
  true,
);
await simple.screenshot({ path: "test-results/mobile-simple.png" });
await simple.getByRole("button", { name: "Explore", exact: true }).click();
await simple.getByRole("button", { name: "Play the crossing" }).waitFor();
await simple.screenshot({ path: "test-results/mobile-explore.png" });
await simple.getByRole("button", { name: "Switch to dark mode" }).click();
await simple.waitForFunction(
  () => document.querySelector(".scene-host")?.dataset.theme === "dark",
);
await simple.screenshot({ path: "test-results/mobile-night.png" });
await simple.close();
const nojs = await browser.newPage({ javaScriptEnabled: false });
await nojs.goto("http://localhost:3000");
assert.ok(
  await nojs.getByRole("heading", { name: "DARS", exact: true }).count(),
);
await nojs.close();
const fail = await browser.newPage();
await fail.addInitScript(() => {
  HTMLCanvasElement.prototype.getContext = function () {
    return null;
  };
});
await fail.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await fail.getByRole("button", { name: "Open simple view" }).click();
assert.equal(await fail.locator("canvas").count(), 0);
await fail.close();
assert.deepEqual(errors, []);
console.log(
  "Browser checks passed: render, modes, persistence, play/pause/exit, direct project URL, reduced motion, mobile overflow, no-JS content.",
);
await browser.close();
