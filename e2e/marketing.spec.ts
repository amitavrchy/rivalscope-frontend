import { test, expect } from "@playwright/test";
for (const width of [360, 768, 1280, 1920]) {
  test(`public landing is responsive at ${width}px without an API`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    const requests: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.route("**/api/**", (route) => {
      requests.push(route.request().url());
      return route.abort();
    });
    await page.goto("/");
    const railWidth = await page
      .locator(".rs-nav")
      .evaluate((element) => element.getBoundingClientRect().width);
    expect(railWidth).toBeCloseTo(width * 0.9, 0);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "See the signals.Make your next move.",
    );
    for (const id of ["features", "workflow", "questions"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page
      .getByText("Where does the research come from?", { exact: true })
      .focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByText("Research uses public sources,", { exact: false }),
    ).toBeVisible();
    await expect(
      page.locator("header").getByRole("link", { name: "Login", exact: true }),
    ).toHaveAttribute("href", "/login");
    await expect(
      page.locator("header").getByRole("link", { name: "Get started" }),
    ).toHaveAttribute("href", "/register");
    expect(errors).toEqual([]);
    expect(requests).toEqual([]);
  });
}
test("complete marketing HTML is usable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#features")).toContainText(
    "Evidence within reach.",
  );
  await expect(page.locator("#workflow")).toContainText(
    "Define your landscape",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    /RivalScope/,
  );
  expect((await page.request.get("/marketing-og.png")).status()).toBe(200);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await context.close();
});
test("existing account-token flow is retained on the public page", async ({
  page,
}) => {
  await page.goto("/?reset=example-token");
  await expect(
    page.getByRole("heading", { name: "Set a new password" }),
  ).toBeVisible();
  await expect(page.getByLabel("New password")).toBeVisible();
});

test("motion scrubs only with scroll, reverses, pauses and respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const pause = page.getByRole("button", { name: "Pause motion", exact: true });
  await expect(pause).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const transform = () =>
    page
      .locator(".rs-radar")
      .evaluate((element) => getComputedStyle(element, "::before").transform);
  const initial = await transform();
  // Deliberately sample elapsed time to catch accidental autoplay.
  await page.waitForTimeout(180);
  expect(await transform()).toBe(initial);
  await page.evaluate(() => window.scrollTo(0, 320));
  await expect.poll(transform).not.toBe(initial);
  const scrolled = await transform();
  await page.waitForTimeout(180);
  expect(await transform()).toBe(scrolled);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(transform).toBe(initial);
  await pause.click();
  await page.evaluate(() => window.scrollTo(0, 480));
  await page.waitForTimeout(100);
  expect(await transform()).toBe(initial);
  await page
    .getByRole("button", { name: "Resume motion", exact: true })
    .click();
  await expect.poll(transform).not.toBe(initial);
  const feature = page.locator(".rs-feature").first();
  const featureTop = await feature.evaluate(
    (element) => element.getBoundingClientRect().top + window.scrollY,
  );
  await page.evaluate(
    (top) => window.scrollTo(0, top - innerHeight * 0.9),
    featureTop,
  );
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  const before = await feature.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await page.evaluate(() => window.scrollBy(0, 220));
  await expect
    .poll(() =>
      feature.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(before);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(pause).toBeHidden();
  await expect.poll(transform).toBe("none");
  await page.evaluate(() => window.scrollTo(0, 0));
  expect(await transform()).toBe("none");
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === "running").length,
    ),
  ).toBe(0);
});
