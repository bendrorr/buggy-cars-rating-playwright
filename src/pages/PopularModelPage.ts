import { expect, Locator, Page } from '@playwright/test';
import { isOnPage } from '../util/CommonAction.ts';
import { faker } from '@faker-js/faker';

export class PopularModelPage {
  private readonly page: Page;
  private readonly table: Locator;
  private readonly commentInput: Locator;
  private readonly voteButton: Locator;
  private readonly successMessage: Locator;
  private readonly totalVoteText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator('table');
    this.commentInput = page.locator('#comment');
    this.voteButton = page.locator('button', { hasText: 'Vote!' });
    this.successMessage = page.getByText('Thank you for your vote!');
    this.totalVoteText = page.locator('h4:has-text("Votes:") strong');
  }

  async commentAndVoteByModelId(modelId: string): Promise<void> {
    const encodedId = encodeURIComponent(modelId);
    await this.page.goto('/model/' + encodedId);
    expect(await isOnPage(this.commentInput)).toBeTruthy();

    await this.commentInput.fill(faker.lorem.sentence());
    expect(await isOnPage(this.voteButton)).toBeTruthy();
    await this.voteButton.click();
  }

  async getSuccessMessageLocator(): Promise<Locator> {
    return this.successMessage;
  }

  async getVoteButton(): Promise<Locator> {
    return this.voteButton;
  }

  async calculateTotalVote(): Promise<number> {
    let voteText: string | null = await this.totalVoteText.textContent();
    return Number(voteText?.trim());
  }

  async isLoaded(): Promise<boolean> {
    return isOnPage(this.table);
  }
}
