import { expect, test } from '@playwright/test';
import { MainPage } from '../../pages/MainPage.ts';
import { RegisterPage } from '../../pages/RegisterPage.ts';
import { generateRegisterData } from '../../util/TestDataUtil.ts';
import { ProfilePage } from '../../pages/ProfilePage.ts';
import { HeaderComponent } from '../../pages/component/HeaderComponent.ts';

test.describe('Negative tests', () => {
  test('Login with invalid credentials', async ({ page }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    expect(await mainPage.isLoaded()).toBeTruthy();

    const header: HeaderComponent = await mainPage.header();
    await header.login('wrong_user', 'WrongPassword123!');
    expect(await header.getLoginErrorMessage()).toBe(
      'Invalid username/password',
    );
  });

  test('Register with existing username', async ({ page }) => {
    const registerPage: RegisterPage = new RegisterPage(page);
    await registerPage.navigate();
    expect(await registerPage.isLoaded()).toBeTruthy();

    const password: string = 'Password123$';
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
    const registerPage: RegisterPage = new RegisterPage(page);
    await registerPage.navigate();
    expect(await registerPage.isLoaded()).toBeTruthy();

    const {
      username,
      firstName,
      lastName,
      password,
    }: {
      username: string;
      firstName: string;
      lastName: string;
      password: string;
    } = generateRegisterData();
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
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    expect(await mainPage.isLoaded()).toBeTruthy();

    const header = await mainPage.header();
    expect(await header.profileButtonIsVisible()).toBeFalsy();
  });

  test('Update profile without filling mandatory fields', async ({ page }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    const header: HeaderComponent = await mainPage.header();

    await header.login('valid_user824', 'Valid123$');
    expect(await header.isLoggedIn()).toBeTruthy();

    await header.goToProfilePage();
    const profilePage: ProfilePage = new ProfilePage(page);

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

    expect(await profilePage.isSaveButtonEnabled()).toBeFalsy();
    expect(await profilePage.getFirstNameIsRequiredMessage()).toContain(
      'First Name is required',
    );
    expect(await profilePage.getLastNameIsRequiredMessage()).toContain(
      'Last Name is required',
    );
  });
});
