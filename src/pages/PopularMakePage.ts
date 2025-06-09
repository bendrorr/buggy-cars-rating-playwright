import { Locator, Page } from '@playwright/test';
import { isOnPage } from '../util/CommonAction.ts';

export class PopularMakePage {
  private readonly table: Locator;
  private readonly rows: Locator;

  constructor(page: Page) {
    this.table = page.locator('table.cars');
    this.rows = this.table.locator('tbody tr');
  }

  async getRowCount(): Promise<number> {
    return await this.rows.count();
  }

  async getModel(rowIndex: number): Promise<string> {
    return (
      (
        await this.rows.nth(rowIndex).locator('td:nth-child(2) a').textContent()
      )?.trim() ?? ''
    );
  }

  async getRank(rowIndex: number): Promise<number> {
    const text = await this.rows
      .nth(rowIndex)
      .locator('td:nth-child(3)')
      .textContent();
    return Number(text?.trim());
  }

  async getVotes(rowIndex: number): Promise<number> {
    const text = await this.rows
      .nth(rowIndex)
      .locator('td:nth-child(4)')
      .textContent();
    return Number(text?.trim());
  }

  async getComments(rowIndex: number): Promise<string[]> {
    const raw = await this.rows
      .nth(rowIndex)
      .locator('p.comment')
      .allTextContents();
    return raw.map((c: string) => c.trim()).filter((c: string) => c.length > 0);
  }

  async isLoaded(): Promise<boolean> {
    return isOnPage(this.table);
  }
}
