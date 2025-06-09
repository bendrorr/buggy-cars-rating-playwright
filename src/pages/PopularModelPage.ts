import { Locator, Page } from '@playwright/test';
import { isOnPage } from '../util/CommonAction.ts';

export class PopularModelPage {
  private readonly table: Locator;

  constructor(page: Page) {
    this.table = page.locator('table');
  }

  async isLoaded(): Promise<boolean> {
    return isOnPage(this.table);
  }
}
