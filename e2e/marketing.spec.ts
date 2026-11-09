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

test("motion is visible, pausable and respects reduced-motion preferences", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const pause = page.getByRole("button", { name: "Pause motion", exact: true });
  await expect(pause).toBeVisible();
  const transform = () =>
    page
      .locator(".rs-radar")
      .evaluate((element) => getComputedStyle(element, "::before").transform);
  const initial = await transform();
  await expect.poll(transform).not.toBe(initial);
  await page.locator(".rs-feature").first().scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator(".rs-feature")
        .first()
        .evaluate(
          (element) =>
            element
              .getAnimations()
              .filter((animation) => animation.playState === "running").length,
        ),
    )
    .toBeGreaterThan(0);
  await pause.click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.playState === "running").length,
      ),
    )
    .toBe(0);
  await page
    .getByRole("button", { name: "Resume motion", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.playState === "running").length,
      ),
    )
    .toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.playState === "running").length,
      ),
    )
    .toBe(0);
  await expect(
    page.getByRole("button", { name: "Pause motion", exact: true }),
  ).toBeHidden();
});
