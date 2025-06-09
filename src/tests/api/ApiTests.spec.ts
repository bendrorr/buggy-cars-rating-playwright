import { APIResponse, expect, test } from '@playwright/test';
import { AuthApi } from '../../api/AuthApi.ts';
import { VALID_USER } from '../../config/BuggyCarsConstants.ts';
import { ProfileApi } from '../../api/ProfileApi.ts';
import { PopularMakeApi } from '../../api/PopularMakeApi.ts';
import { PopularModelApi } from '../../api/PopularModelApi.ts';

test.describe('API tests', () => {
  test('Login returns valid token', async ({ request }) => {
    const authApi = new AuthApi(request);
    const token = await authApi.login(VALID_USER.username, VALID_USER.password);
    console.log(token);

    expect(token).toBeTruthy();
  });

  test('Fetch user profile using token', async ({ request }) => {
    const authApi = new AuthApi(request);
    const token = await authApi.login(VALID_USER.username, VALID_USER.password);

    const profileApi = new ProfileApi(request, token);
    const profile = await profileApi.getProfile();
    console.log(profile);

    expect(profile).toHaveProperty('username');
    expect(profile).toHaveProperty('firstName');
    expect(profile).toHaveProperty('lastName');
    expect(profile).toHaveProperty('gender');
    expect(profile).toHaveProperty('age');
    expect(profile).toHaveProperty('address');
    expect(profile).toHaveProperty('phone');
    expect(profile).toHaveProperty('hobby');
  });

  test('Update profile', async ({ request }) => {
    const authApi = new AuthApi(request);
    const token = await authApi.login(VALID_USER.username, VALID_USER.password);
    console.log(token);

    const profileApi = new ProfileApi(request, token);

    const response = await profileApi.updateProfile({
      username: VALID_USER.username,
      firstName: 'firstName',
      lastName: 'lastName',
      gender: '',
      age: '',
      address: '',
      phone: '',
      hobby: 'Reading Comics',
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    });
    console.log(response);

    expect(response.ok()).toBeTruthy();
  });

  test('Get models by make', async ({ request }) => {
    const authApi = new AuthApi(request);
    const token = await authApi.login(VALID_USER.username, VALID_USER.password);

    const makeApi = new PopularMakeApi(request, token);
    const response = await makeApi.getPopularMakes('ckl2phsabijs71623vk0');

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log(data);
  });

  test('Get all models', async ({ request }) => {
    const authApi = new AuthApi(request);
    const token = await authApi.login(VALID_USER.username, VALID_USER.password);

    const popularModelApi = new PopularModelApi(request, token);
    const response = await popularModelApi.getAllModels();

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    console.log(data);
  });

  test('Get model by ID for all models', async ({ request }) => {
    const authApi = new AuthApi(request);
    const token = await authApi.login(VALID_USER.username, VALID_USER.password);

    const modelApi = new PopularModelApi(request, token);
    const allModelsResponse = await modelApi.getAllModels();
    expect(allModelsResponse.ok()).toBeTruthy();

    const { models } = await allModelsResponse.json();
    expect(models.length).toBeGreaterThan(0);

    for (const { id: modelId, name } of models) {
      const response: APIResponse = await modelApi.getModelById(modelId);
      expect(response.ok()).toBeTruthy();

      const modelData: any = await response.json();
      console.log(`Model [${name}] Data:`, modelData);

      expect(modelData).toHaveProperty('name');
      expect(modelData).toHaveProperty('make');
      expect(modelData).toHaveProperty('description');
      expect(modelData).toHaveProperty('votes');
      expect(modelData).toHaveProperty('engineVol');
      expect(modelData).toHaveProperty('comments');
      expect(Array.isArray(modelData.comments)).toBeTruthy();
    }
  });

});
