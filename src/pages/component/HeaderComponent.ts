import { Locator, Page } from '@playwright/test';
import { isOnPage } from '../../util/CommonAction.ts';

export class HeaderComponent {
  private readonly mainPageButton: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly registerButton: Locator;
  private readonly profileButton: Locator;
  private readonly logoutButton: Locator;
  private readonly loginErrorMessage: Locator;

  constructor(page: Page) {
    this.usernameInput = page.getByPlaceholder('Login');
    this.passwordInput = page.locator('input[ngmodel][name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.logoutButton = page.getByRole('link', { name: 'Logout' });
    this.mainPageButton = page.getByRole('link', { name: 'Buggy Rating' });
    this.profileButton = page.getByRole('link', { name: 'Profile' });
    this.registerButton = page.getByRole('link', { name: 'Register' });
    this.loginErrorMessage = page.getByText('Invalid username/password');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async goToRegisterPage(): Promise<void> {
    await this.registerButton.click();
  }

  async goToProfilePage(): Promise<void> {
    await this.profileButton.click();
  }

  async goToMainPage(): Promise<void> {
    await this.mainPageButton.click();
  }

  async getLoginErrorMessage(): Promise<string> {
    return this.loginErrorMessage.innerText();
  }

  async profileButtonIsVisible(): Promise<boolean> {
    return await this.profileButton.isVisible();
  }

  async isLoggedIn(): Promise<boolean> {
    return isOnPage(this.logoutButton);
  }

  async isLoggedOut(): Promise<boolean> {
    return isOnPage(this.loginButton);
  }
}
