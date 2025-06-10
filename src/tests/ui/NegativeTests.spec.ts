import { APIResponse, expect, Locator, test } from '@playwright/test';
import { MainPage } from '../../pages/MainPage.ts';
import { RegisterPage } from '../../pages/RegisterPage.ts';
import { generateRegisterData } from '../../util/TestDataUtil.ts';
import { ProfilePage } from '../../pages/ProfilePage.ts';
import { HeaderComponent } from '../../pages/component/HeaderComponent.ts';
import { UserCredentials } from '../../model/UserCredentials.ts';
import { AuthApi } from '../../api/AuthApi.ts';
import { PopularModelApi } from '../../api/PopularModelApi.ts';
import { PopularModelPage } from '../../pages/PopularModelPage.ts';
import { readVisibleText } from '../../util/CommonAction.ts';

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

    let userCredentials: UserCredentials = generateRegisterData();

    await registerPage.register(
      userCredentials.firstName,
      userCredentials.lastName,
      userCredentials.username,
      userCredentials.password,
      userCredentials.password + '$',
    );

    expect(await registerPage.getPasswordDoNotMatchMessage()).toContain(
      'Passwords do not match',
    );
  });

  test('Access profile page without login', async ({ page }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    expect(await mainPage.isLoaded()).toBeTruthy();

    const header: HeaderComponent = await mainPage.header();
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

  test('Cannot vote twice for the same model', async ({ page, request }) => {
    let registerPage: RegisterPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.isLoaded();

    let userCredentials: UserCredentials = generateRegisterData();

    await registerPage.register(
      userCredentials.firstName,
      userCredentials.lastName,
      userCredentials.username,
      userCredentials.password,
      userCredentials.confirmPassword,
    );
    expect(await registerPage.getSuccessMessage()).toContain(
      'Registration is successful',
    );

    let mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    let headerComponent: HeaderComponent = await mainPage.header();

    await headerComponent.login(
      userCredentials.username,
      userCredentials.password,
    );
    expect(await headerComponent.isLoggedIn()).toBeTruthy();

    const authApi: AuthApi = new AuthApi(request);

    const token: string = await authApi.login(
      userCredentials.username,
      userCredentials.password,
    );
    const modelApi: PopularModelApi = new PopularModelApi(request, token);

    const allModelsResponse: APIResponse = await modelApi.getAllModels();
    expect(allModelsResponse.ok()).toBeTruthy();

    const { models } = await allModelsResponse.json();
    expect(models.length).toBeGreaterThan(0);

    let modelId: any = models[0].id;
    let popularModelPage: PopularModelPage = new PopularModelPage(page);
    await popularModelPage.commentAndVoteByModelId(modelId);
    let successMessageLocator: Promise<Locator> =
      popularModelPage.getSuccessMessageLocator();

    expect(await readVisibleText(await successMessageLocator)).toContain(
      'Thank you for your vote!',
    );

    await expect(await popularModelPage.getVoteButton()).toBeHidden();
  });
});
