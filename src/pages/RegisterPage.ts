import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from './component/HeaderComponent.ts';
import { isOnPage, readVisibleText } from '../util/CommonAction.ts';

export class RegisterPage {
  private readonly page: Page;
  private readonly loginInput: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly registerButton: Locator;
  private readonly cancelButton: Locator;
  private readonly successMessage: Locator;
  private readonly userAlreadyExistsMessage: Locator;
  private readonly passwordDoNotMatchMessage: Locator;
  private readonly headerComponent: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.loginInput = page.locator('#username');
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.passwordInput = page.getByRole('textbox', {
      name: 'Password',
      exact: true,
    });
    this.confirmPasswordInput = page.getByRole('textbox', {
      name: 'Confirm Password',
    });
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.successMessage = page.getByText('Registration is successful');
    this.passwordDoNotMatchMessage = page.getByText('Passwords do not match');
    this.userAlreadyExistsMessage = page.getByText(
      'UsernameExistsException: User already exists',
    );
    this.headerComponent = new HeaderComponent(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto('/register');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async register(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    confirmPassword: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.loginInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);

    if (await this.registerButton.isEnabled({ timeout: 2000 })) {
      await this.registerButton.click();
    }
  }

  async header(): Promise<HeaderComponent> {
    return this.headerComponent;
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async getSuccessMessage(): Promise<string | null> {
    return readVisibleText(this.successMessage);
  }

  async getUserAlreadyExistsMessage(): Promise<string | null> {
    return readVisibleText(this.userAlreadyExistsMessage);
  }

  async getPasswordDoNotMatchMessage(): Promise<string | null> {
    return readVisibleText(this.passwordDoNotMatchMessage);
  }

  async isLoaded(): Promise<boolean> {
    return isOnPage(
      this.firstNameInput,
      this.lastNameInput,
      this.registerButton,
    );
  }
}
