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
    expect(railWidth).toBeCloseTo(width * 0.8, 0);
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

test("section motion scrubs with scroll, reverses, pauses and respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const pause = page.getByRole("button", { name: "Pause motion", exact: true });
  await expect(pause).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const transform = () =>
    page
      .locator(".rs-hero-copy")
      .evaluate((element) => getComputedStyle(element).transform);
  const initial = await transform();
  // Deliberately sample elapsed time to catch accidental autoplay.
  await page.waitForTimeout(180);
  expect(await transform()).toBe(initial);
  await page.evaluate(() => window.scrollTo({ top: 320, behavior: "instant" }));
  await expect.poll(transform).not.toBe(initial);
  const scrolled = await transform();
  await page.waitForTimeout(180);
  expect(await transform()).toBe(scrolled);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(transform).toBe(initial);
  await pause.click();
  await page.evaluate(() => window.scrollTo({ top: 480, behavior: "instant" }));
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
    (top) =>
      window.scrollTo({ top: top - innerHeight * 0.9, behavior: "instant" }),
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
  await page.evaluate(() => window.scrollBy({ top: 220, behavior: "instant" }));
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

for (const width of [360, 1280]) {
  test(`section links and FAQ expand/collapse transition smoothly at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Pause motion", exact: true }),
    ).toBeVisible();
    await page.locator('header a[href="#features"]').click();
    const target = page.locator("#features");
    const destination = await target.evaluate(
      (element) =>
        element.getBoundingClientRect().top +
        scrollY -
        parseFloat(getComputedStyle(element).scrollMarginTop),
    );
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
    expect(await page.evaluate(() => scrollY)).toBeLessThan(destination - 5);
    await expect
      .poll(() =>
        page.evaluate(
          (destination) => Math.abs(scrollY - destination),
          destination,
        ),
      )
      .toBeLessThan(2);
    await expect(page).toHaveURL(/#features$/);
    await page.locator('header a[href="#questions"]').click();
    const faqDestination = await page
      .locator("#questions")
      .evaluate(
        (element) =>
          element.getBoundingClientRect().top +
          scrollY -
          parseFloat(getComputedStyle(element).scrollMarginTop),
      );
    await expect
      .poll(() =>
        page.evaluate(
          (destination) => Math.abs(scrollY - destination),
          faqDestination,
        ),
      )
      .toBeLessThan(2);
    const details = page.locator(".rs-faq details").first();
    const summary = details.locator("summary");
    const activateSummary = async () => {
      const box = await summary.boundingBox();
      if (!box) throw new Error("FAQ summary must be visible");
      await page.mouse.click(box.x + 20, box.y + Math.min(20, box.height / 2));
    };
    const collapsed = await details.evaluate(
      (element) => element.getBoundingClientRect().height,
    );
    await activateSummary();
    expect(
      await details.evaluate((element) =>
        element
          .getAnimations()
          .some((animation) => animation.playState === "running"),
      ),
    ).toBe(true);
    await expect
      .poll(() =>
        details.evaluate((element) => element.getBoundingClientRect().height),
      )
      .toBeGreaterThan(collapsed + 8);
    await details.evaluate((element) =>
      Promise.all(
        element
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      ),
    );
    await activateSummary();
    expect(
      await details.evaluate((element) => (element as HTMLDetailsElement).open),
    ).toBe(true);
    await expect
      .poll(() =>
        details.evaluate((element) => (element as HTMLDetailsElement).open),
      )
      .toBe(false);
    expect(
      await details.evaluate(
        (element) => element.getBoundingClientRect().height,
      ),
    ).toBeCloseTo(collapsed, 0);
    // Changing direction during a transition must settle at the latest requested state.
    await activateSummary();
    await activateSummary();
    await activateSummary();
    await details.evaluate((element) =>
      Promise.all(
        element
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      ),
    );
    expect(
      await details.evaluate((element) => (element as HTMLDetailsElement).open),
    ).toBe(true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() =>
        page.evaluate(
          () => getComputedStyle(document.documentElement).scrollBehavior,
        ),
      )
      .toBe("auto");
    await activateSummary();
    expect(
      await details.evaluate((element) => (element as HTMLDetailsElement).open),
    ).toBe(false);
    expect(
      await details.evaluate((element) => element.getAnimations().length),
    ).toBe(0);
  });
}

test("hero radar runs automatically while idle and honors pause and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const pause = page.getByRole("button", { name: "Pause motion", exact: true });
  await expect(pause).toBeVisible();
  const radar = page.locator(".rs-radar");
  const transform = () =>
    radar.evaluate(
      (element) => getComputedStyle(element, "::before").transform,
    );
  const initial = await transform();
  await expect.poll(transform).not.toBe(initial);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await pause.click();
  await expect
    .poll(() =>
      radar.evaluate(
        (element) => getComputedStyle(element, "::before").animationPlayState,
      ),
    )
    .toBe("paused");
  const stopped = await transform();
  await page.waitForTimeout(180);
  expect(await transform()).toBe(stopped);
  await page
    .getByRole("button", { name: "Resume motion", exact: true })
    .click();
  await expect.poll(transform).not.toBe(stopped);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      radar.evaluate(
        (element) => getComputedStyle(element, "::before").animationName,
      ),
    )
    .toBe("none");
  await expect.poll(transform).toBe("none");
});
