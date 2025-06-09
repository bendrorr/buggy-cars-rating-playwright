import { Locator } from '@playwright/test';

export async function readVisibleText(
  locator: Locator,
): Promise<string | null> {
  await locator.waitFor({ state: 'visible', timeout: 5000 });
  return (await locator.isVisible()) ? await locator.textContent() : null;
}

export async function isOnPage(...locators: Locator[]): Promise<boolean> {
  for (let locator of locators) {
    await locator.waitFor({ state: 'visible', timeout: 7000 });
    if (!(await locator.isVisible())) {
      return false;
    }
  }
  return true;
}
