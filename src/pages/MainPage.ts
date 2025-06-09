import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from './component/HeaderComponent.ts';
import { isOnPage } from '../util/CommonAction.ts';

export class MainPage {
  private readonly page: Page;
  private readonly headerComponent: HeaderComponent;
  private readonly popularMakeLink: Locator;
  private readonly popularModelLink: Locator;
  private readonly overallRatingLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerComponent = new HeaderComponent(page);
    this.popularMakeLink = page.locator('[href="/make/ckl2phsabijs71623vk0"]');
    this.popularModelLink = page.locator(
      '[href="/model/ckl2phsabijs71623vk0|ckl2phsabijs71623vqg"]',
    );
    this.overallRatingLink = page.locator('[href="/overall"]');
  }

  async goToMainPage(): Promise<void> {
    await this.page.goto('/');
  }

  async goToPopularMakePage(): Promise<void> {
    await this.popularMakeLink.click();
  }

  async goToPopularModelPage(): Promise<void> {
    await this.popularModelLink.click();
  }

  async goToOverallRatingPage(): Promise<void> {
    await this.overallRatingLink.click();
  }

  async header(): Promise<HeaderComponent> {
    return this.headerComponent;
  }

  async isLoaded(): Promise<boolean> {
    return isOnPage(this.popularMakeLink);
  }
}
