import { expect, test } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage.ts';
import { AuthApi } from '../../api/AuthApi.ts';
import { ProfileApi } from '../../api/ProfileApi.ts';
import { ProfilePage } from '../../pages/ProfilePage.ts';
import { MainPage } from '../../pages/MainPage.ts';
import { VALID_USER } from '../../constants/BuggyCarsConstants.ts';
import { HeaderComponent } from '../../pages/component/HeaderComponent.ts';

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
});
