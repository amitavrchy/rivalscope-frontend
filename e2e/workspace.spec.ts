import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
test('real proxy registration, private session, project write and sign-out', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('Your name').fill('Synthetic browser analyst');
  await page.getByLabel('Workspace name').fill(`Browser verification ${randomUUID()}`);
  await page.getByLabel('Work email').fill(`${randomUUID()}@browser.invalid`);
  await page.getByLabel('Password', { exact: true }).fill(randomUUID());
  await page.getByRole('button', { name: 'Create workspace', exact: true }).click();
  await expect(page.locator('#workspace-main')).toBeVisible();
  const session = (await page.context().cookies()).find(cookie => cookie.name === 'rs_session');
  expect(session?.httpOnly).toBe(true);
  const me = await page.request.get('/api/auth/me');
  expect(me.status()).toBe(200);
  expect(me.headers()['cache-control']).toContain('no-store');
  const profile = await me.json();
  const org = profile.memberships[0].organization.id;
  const project = await page.request.post(`/api/organizations/${org}/projects`, {
    headers: { Origin: 'http://localhost:3001' },
    data: { name: 'Browser verified synthetic project', description: 'A fictional project persisted through the actual API for browser verification.' },
  });
  expect(project.status()).toBe(201);
  await page.reload();
  await expect(page.getByText('Browser verified synthetic project').first()).toBeVisible();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/\/login/);
  expect((await page.request.get('/api/auth/me')).status()).toBe(401);
});
test('public page renders independently and anonymous access stays blocked', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto('/workspace/overview');
  await expect(page.getByRole('heading', { name: 'Your workspace is a sign-in away.' })).toBeVisible();
});
