import { Locator, Page } from '@playwright/test';

export class HeaderPage {
  private readonly page: Page;
  private readonly homeButton: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly registerButton: Locator;
  private readonly profileButtons: Function;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Login' });
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }
}
