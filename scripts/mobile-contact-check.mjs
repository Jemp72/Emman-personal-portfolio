import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--enable-webgl",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
try {
  for (const width of [320, 390, 768]) {
    const page = await browser.newPage({
      viewport: { width, height: 844 },
      reducedMotion: "reduce",
    });
    await page.goto("http://localhost:3000/contact/");
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await page.getByLabel("Your name").fill("Portfolio visitor");
    await page.getByLabel("Your email").fill("visitor@example.com");
    await page.getByLabel("Your message").fill("I have a project idea.");
    assert.equal(
      await page.locator("form").evaluate((f) => f.checkValidity()),
      true,
    );
    await page.screenshot({ path: `test-results/contact-${width}.png` });
    if (width === 390) {
      await page.goto("http://localhost:3000");
      await page.getByRole("button", { name: "Explore", exact: true }).click();
      await page.getByRole("button", { name: "Play the crossing" }).waitFor();
      await page.evaluate(() => scrollTo({ top: 600, behavior: "instant" }));
      await page.waitForTimeout(700);
      assert.ok(
        await page
          .locator(".world")
          .evaluate(
            (el) => el.getBoundingClientRect().height < innerHeight * 0.5,
          ),
      );
      assert.ok(
        await page.evaluate(
          () =>
            Number(getComputedStyle(document.querySelector(".world")).zIndex) >
            Number(
              getComputedStyle(document.querySelector(".portfolio")).zIndex,
            ),
        ),
      );
      await page.screenshot({ path: "test-results/mobile-stacking.png" });
      await page.getByRole("button", { name: "Play the crossing" }).click();
      await page.getByRole("button", { name: "Let’s hop" }).click();
      for (const [key, yaw] of [
        ["ArrowRight", -Math.PI / 2],
        ["ArrowLeft", Math.PI / 2],
        ["ArrowUp", 0],
        ["ArrowDown", Math.PI],
      ]) {
        await page.keyboard.press(key);
        await page.waitForTimeout(300);
        const actual = Number(
          await page.locator(".scene-host").getAttribute("data-facing"),
        );
        assert.ok(
          Math.abs(Math.cos(actual) - Math.cos(yaw)) < 0.01 &&
            Math.abs(Math.sin(actual) - Math.sin(yaw)) < 0.01,
          `${key}: ${actual}, expected ${yaw}`,
        );
      }
      await page.setViewportSize({ width: 844, height: 390 });
      await page.getByRole("button", { name: "Pause", exact: true }).click();
      await page.screenshot({ path: "test-results/mobile-landscape.png" });
    }
    await page.close();
  }
  console.log(
    "Passed contact layouts at 320/390/768px, form validation, mobile stacking, four movement headings, landscape rendering.",
  );
} finally {
  await browser.close();
}
