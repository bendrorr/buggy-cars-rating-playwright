import { APIRequestContext, APIResponse } from '@playwright/test';
import { BASE_URL_API } from '../config/BuggyCarsConstants.ts';

export class AuthApi {
  constructor(private apiRequestContext: APIRequestContext) {}

  async login(username: string, password: string): Promise<string> {
    const response: APIResponse = await this.apiRequestContext.post(
      BASE_URL_API + '/prod/oauth/token',
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        form: {
          grant_type: 'password',
          username,
          password,
        },
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Failed to get token: ${response.status()} ${response.statusText()}`,
      );
    }

    const body = await response.json();
    return body.access_token;
  }
}
