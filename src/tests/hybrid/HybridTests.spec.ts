import { expect, Locator, test } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage.ts';
import { AuthApi } from '../../api/AuthApi.ts';
import { ProfileApi } from '../../api/ProfileApi.ts';
import { ProfilePage } from '../../pages/ProfilePage.ts';
import { MainPage } from '../../pages/MainPage.ts';
import { VALID_USER } from '../../config/BuggyCarsConstants.ts';
import { HeaderComponent } from '../../pages/component/HeaderComponent.ts';
import { PopularModelApi } from '../../api/PopularModelApi.ts';
import { PopularModelPage } from '../../pages/PopularModelPage.ts';
import { generateRegisterData } from '../../util/TestDataUtil.ts';
import { UserCredentials } from '../../model/UserCredentials.ts';
import { readVisibleText } from '../../util/CommonAction.ts';

test.describe('Hybrid UI + API tests', () => {
  test('Register user via UI, then validate profile via API', async ({
    page,
    request,
  }) => {
    const username: string = `user_${Date.now()}`;
    const password: string = 'TestPass123!';

    const registerPage: RegisterPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.register('John', 'Doe', username, password, password);

    const success: string | null = await registerPage.getSuccessMessage();
    expect(success).toContain('Registration is successful');

    const authApi: AuthApi = new AuthApi(request);
    const token: string = await authApi.login(username, password);
    const profileApi: ProfileApi = new ProfileApi(request, token);
    const profile = await profileApi.getProfile();

    expect(profile.firstName).toBe('John');
    expect(profile.lastName).toBe('Doe');
    expect(profile.username).toBe(username);
  });

  test('Login via API and update profile via UI', async ({ page, request }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    const header: HeaderComponent = await mainPage.header();
    await header.login(VALID_USER.username, VALID_USER.password);
    expect(await header.isLoggedIn()).toBeTruthy();

    await header.goToProfilePage();
    const profilePage = new ProfilePage(page);
    await profilePage.updateProfile({
      firstName: 'UpdatedName',
      lastName: 'UpdatedLast',
      gender: 'Male',
      age: '30',
      address: '123 Street',
      phone: '123456789',
      hobby: 'Reading',
      language: 'English',
    });

    const message: string | null = await profilePage.getSuccessMessage();
    expect(message).toContain('The profile has been saved');

    const authApi: AuthApi = new AuthApi(request);
    const token: string = await authApi.login(
      VALID_USER.username,
      VALID_USER.password,
    );
    const profileApi: ProfileApi = new ProfileApi(request, token);
    const profile: any = await profileApi.getProfile();
    expect(profile.firstName).toBe('UpdatedName');
    expect(profile.lastName).toBe('UpdatedLast');
  });

  test('should register, login, and vote for a car model successfully', async ({
    page,
    request,
  }) => {
    let registerPage = new RegisterPage(page);
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

    let mainPage = new MainPage(page);
    await mainPage.goToMainPage();
    let headerComponent = await mainPage.header();

    await headerComponent.login(
      userCredentials.username,
      userCredentials.password,
    );
    await headerComponent.isLoggedIn();

    let popularModelPage: PopularModelPage = new PopularModelPage(page);

    const authApi = new AuthApi(request);
    const token = await authApi.login(
      userCredentials.username,
      userCredentials.password,
    );

    const modelApi = new PopularModelApi(request, token);
    const allModelsResponse = await modelApi.getAllModels();
    expect(allModelsResponse.ok()).toBeTruthy();

    const { models } = await allModelsResponse.json();
    expect(models.length).toBeGreaterThan(0);
    let modelId: string = models[0].id;

    await popularModelPage.commentAndVoteByModelId(modelId);
    let successMessageLocator: Promise<Locator> =
      popularModelPage.getSuccessMessageLocator();

    expect(await readVisibleText(await successMessageLocator)).toContain(
      'Thank you for your vote!',
    );
  });
});
