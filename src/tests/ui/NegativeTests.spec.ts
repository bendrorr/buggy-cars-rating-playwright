import { expect, test } from '@playwright/test';
import { MainPage } from '../pages/MainPage.ts';
import { RegisterPage } from '../pages/RegisterPage.ts';
import { generateRegisterData } from '../util/TestDataUtil.ts';
import { PopularModelPage } from '../pages/PopularModelPage.ts';
import { ProfilePage } from '../pages/ProfilePage.ts';

test.describe('Full user flow - register, login, profile update, and model check', () => {
  test('Login with invalid credentials', async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goToMainPage();
    await mainPage.isLoaded();

    const header = await mainPage.header();
    await header.login('wrong_user', 'WrongPassword123!');
    expect(await header.getLoginErrorMessage()).toBe(
      'Invalid username/password',
    );
  });

  test('Register with existing username', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    const password = 'Password123$';
    await registerPage.register(
      'John',
      'Doe',
      'valid_user824',
      password,
      password,
    );

    expect(await registerPage.getUserAlreadyExistsMessage()).toContain(
      'already exists',
    );
  });

  test('Register with mismatched passwords', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    const { username, firstName, lastName, password } = generateRegisterData();
    await registerPage.register(
      firstName,
      lastName,
      username,
      password,
      'WrongConfirm123$',
    );

    expect(await registerPage.getPasswordDoNotMatchMessage()).toContain(
      'Passwords do not match',
    );
  });

  test('Access profile page without login', async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goToMainPage();
    await mainPage.isLoaded();

    const header = await mainPage.header();
    expect(await header.profileButtonIsVisible()).toBeFalsy();
  });

  test('Logout without being logged in', async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goToMainPage();
    const header = await mainPage.header();

    expect(await header.logoutButtonIsVisible()).toBeFalsy();
  });

  test('Navigate to broken Popular Model page', async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goToMainPage();

    await page.goto('https://buggy.justtestit.org/model/invalid-model-id');
    const popularModelPage = new PopularModelPage(page);
    page.waitForTimeout(5000);
    expect(await popularModelPage.isLoaded()).toBe(false);
  });

  test('Update profile without filling mandatory fields', async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goToMainPage();
    const header = await mainPage.header();

    await header.login('valid_user824', 'Valid123$');
    expect(await header.isLoggedIn()).toBe(true);

    await header.goToProfilePage();
    const profilePage = new ProfilePage(page);

    await profilePage.updateProfile({
      firstName: '',
      lastName: '',
      gender: '',
      age: '',
      address: '',
      phone: '',
      hobby: '',
      language: '',
    });

    const message = await profilePage.getSuccessMessage();
    expect(message).not.toContain('saved successful');
  });
});
