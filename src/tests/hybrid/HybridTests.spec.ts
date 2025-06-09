import { expect, test } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage.ts';
import { AuthApi } from '../../api/AuthApi.ts';
import { ProfileApi } from '../../api/ProfileApi.ts';

test('Register user via UI, then validate profile via API', async ({
  page,
  request,
}) => {
  const username = `user_${Date.now()}`;
  const password = 'TestPass123!';

  const registerPage = new RegisterPage(page);
  await registerPage.navigate();
  await registerPage.register('John', 'Doe', username, password, password);

  const success = await registerPage.getSuccessMessage();
  expect(success).toContain('Registration is successful');

  const authApi = new AuthApi(request);
  const token = await authApi.login(username, password);
  const profileApi = new ProfileApi(request, token);
  const profile = await profileApi.getProfile();

  expect(profile.firstName).toBe('John');
  expect(profile.lastName).toBe('Doe');
  expect(profile.username).toBe(username);
});
