import { expect, Locator, Page } from '@playwright/test';
import { HeaderComponent } from './component/HeaderComponent.ts';
import { isOnPage, readVisibleText } from '../util/CommonAction.ts';

export class ProfilePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly genderInput: Locator;
  private readonly ageInput: Locator;
  private readonly addressInput: Locator;
  private readonly phoneInput: Locator;
  private readonly hobbyOptions: Locator;
  private readonly languageOptions: Locator;
  private readonly saveButton: Locator;
  private readonly successMessage: Locator;
  private readonly firstNameIsRequiredMessage: Locator;
  private readonly lastNameIsRequiredMessage: Locator;
  private readonly headerComponent: HeaderComponent;

  constructor(page: Page) {
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.genderInput = page.locator('#gender');
    this.ageInput = page.locator('#age');
    this.addressInput = page.locator('#address');
    this.phoneInput = page.locator('#phone');
    this.hobbyOptions = page.locator('#hobby');
    this.languageOptions = page.locator('#language');
    this.saveButton = page.locator('[type="submit"]');
    this.successMessage = page.getByText('The profile has been saved').first();
    this.firstNameIsRequiredMessage = page.getByText('First Name is required');
    this.lastNameIsRequiredMessage = page.getByText('Last Name is required');
    this.headerComponent = new HeaderComponent(page);
  }

  async updateProfile(data: {
    firstName: string;
    lastName: string;
    gender: string;
    age: string;
    address: string;
    phone: string;
    hobby?: string;
    language?: string;
  }): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.genderInput.fill(data.gender);
    await this.ageInput.fill(data.age);
    await this.addressInput.fill(data.address);
    await this.phoneInput.fill(data.phone);

    if (data.hobby) {
      await this.hobbyOptions.selectOption(data.hobby);
    }

    if (data.language) {
      await this.languageOptions.selectOption(data.language);
    }
    expect(isOnPage(this.saveButton)).toBeTruthy();

    if (await this.isSaveButtonEnabled()) {
      await this.saveButton.click();
    }
  }

  async isSaveButtonEnabled(): Promise<boolean> {
    return await this.saveButton.isEnabled({ timeout: 3000 });
  }

  async getSuccessMessage(): Promise<string | null> {
    return readVisibleText(this.successMessage);
  }

  async getFirstNameIsRequiredMessage(): Promise<string | null> {
    return readVisibleText(this.firstNameIsRequiredMessage);
  }

  async getLastNameIsRequiredMessage(): Promise<string | null> {
    return readVisibleText(this.lastNameIsRequiredMessage);
  }

  async header(): Promise<HeaderComponent> {
    return this.headerComponent;
  }

  async isLoaded(): Promise<boolean> {
    return isOnPage(this.saveButton, this.firstNameInput, this.lastNameInput);
  }
}
