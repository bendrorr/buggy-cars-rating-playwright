import { expect, test } from '@playwright/test';
import { MainPage } from '../../pages/MainPage.ts';
import { RegisterPage } from '../../pages/RegisterPage.ts';
import { generateRegisterData } from '../../util/TestDataUtil.ts';
import { ProfilePage } from '../../pages/ProfilePage.ts';
import { PopularMakePage } from '../../pages/PopularMakePage.ts';
import { PopularModelPage } from '../../pages/PopularModelPage.ts';
import { VALID_USER } from '../../constants/BuggyCarsConstants.ts';
import { OverallRatingPage } from '../../pages/OverallRatingPage.ts';
import { HeaderComponent } from '../../pages/component/HeaderComponent.ts';

test.describe('Full user flow - register, login, profile update, and model check', () => {
  test('Login with valid credentials', async ({ page }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    expect(await mainPage.isLoaded()).toBeTruthy();

    const header = await mainPage.header();
    await header.login(VALID_USER.username, VALID_USER.password);

    expect(await header.isLoggedIn()).toBeTruthy();
  });

  test('Register new user', async ({ page }) => {
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
      password,
    );

    expect(await registerPage.getSuccessMessage()).toContain(
      'Registration is successful',
    );
  });

  test('Register and login new user', async ({ page }) => {
    const registerPage: RegisterPage = new RegisterPage(page);
    await registerPage.navigate();
    expect(await registerPage.isLoaded()).toBeTruthy();

    const username: string = `user${Date.now()}`;
    const password: string = 'Password123$';
    await registerPage.register('Jane', 'Smith', username, password, password);

    expect(await registerPage.getSuccessMessage()).toContain(
      'Registration is successful',
    );

    const header: HeaderComponent = await registerPage.header();
    await header.login(username, password);

    expect(await header.isLoggedIn()).toBeTruthy();
  });

  test('Navigate to profile page after login', async ({ page }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    expect(await mainPage.isLoaded()).toBeTruthy();

    const header = await mainPage.header();
    await header.login(VALID_USER.username, VALID_USER.password);
    expect(await header.isLoggedIn()).toBeTruthy();

    await header.goToProfilePage();
    await expect(page).toHaveURL(/.*profile/);
  });

  test('Logout after login', async ({ page }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    const header = await mainPage.header();

    await header.login(VALID_USER.username, VALID_USER.password);
    expect(await header.isLoggedIn()).toBeTruthy();

    await header.logout();
    expect(await header.isLoggedOut()).toBeTruthy();
  });

  test('Clicking main page button returns to home', async ({ page }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    const header: HeaderComponent = await mainPage.header();

    await header.login(VALID_USER.username, VALID_USER.password);
    await header.goToProfilePage();

    await header.goToMainPage();
    await expect(page).toHaveURL('https://buggy.justtestit.org/');
  });

  test('Navigate to register page from header', async ({ page }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    const header = await mainPage.header();

    await header.goToRegisterPage();
    await expect(page).toHaveURL(/.*register/);
  });

  test('Update user profile information', async ({ page }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    const header = await mainPage.header();

    await header.login(VALID_USER.username, VALID_USER.password);
    expect(await header.isLoggedIn()).toBeTruthy();

    await header.goToProfilePage();
    const profilePage = new ProfilePage(page);
    expect(await profilePage.isLoaded()).toBeTruthy();

    await profilePage.updateProfile({
      firstName: 'Updated',
      lastName: 'User',
      gender: 'Other',
      age: '30',
      address: 'Tel Aviv',
      phone: '0501234567',
      hobby: 'Reading Comics',
      language: 'English',
    });

    expect(await profilePage.getSuccessMessage()).toContain(
      'The profile has been saved successful'.trim(),
    );
  });

  test('Extract and validate data from Popular Make page', async ({ page }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    await mainPage.goToPopularMakePage();
    const popularMakePage = new PopularMakePage(page);

    expect(await popularMakePage.isLoaded()).toBeTruthy();

    const rowCount = await popularMakePage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      const model = await popularMakePage.getModel(i);
      const rank = await popularMakePage.getRank(i);
      const votes = await popularMakePage.getVotes(i);
      const comments = await popularMakePage.getComments(i);

      console.log(`Model: ${model}, Rank: ${rank}, Votes: ${votes}`);
      console.log('Comments:', comments);

      expect(model).not.toBe('');
      expect(rank).toBeGreaterThan(0);
      expect(votes).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(comments)).toBe(true);
    }
  });

  test('Navigate to Popular Model page and verify it is loaded', async ({
    page,
  }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    await mainPage.goToPopularModelPage();
    const popularModelPage = new PopularModelPage(page);
    expect(await popularModelPage.isLoaded()).toBeTruthy();
  });

  test('Navigate to Overall Rating Page and verify it is loaded', async ({
    page,
  }) => {
    const mainPage: MainPage = new MainPage(page);
    await mainPage.goToMainPage();
    await mainPage.goToOverallRatingPage();
    const overallRatingPage = new OverallRatingPage(page);
    expect(await overallRatingPage.isLoaded()).toBeTruthy();
  });
});
