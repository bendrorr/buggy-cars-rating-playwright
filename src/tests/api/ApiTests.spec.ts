import { test } from '@playwright/test';
import { LoginApi } from '../../api/LoginApi.ts';


test('Register new user', async ({ request }) => {
  const loginApi = new LoginApi(request);
  const token = await loginApi.getToken('valid_user824', 'Valid123$');
});
