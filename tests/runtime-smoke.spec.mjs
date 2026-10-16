import { test, expect } from '@playwright/test';

test('Reading boots and renders the first paper without browser errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await expect(page.locator('#paperOverview')).toContainText('Practice Paper 1');
  await expect(page.locator('body')).toContainText('Community Projects');
  expect(pageErrors).toEqual([]);
});
