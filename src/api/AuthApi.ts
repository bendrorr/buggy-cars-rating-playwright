import { APIRequestContext, APIResponse } from '@playwright/test';

export class LoginApi {
  private readonly apiRequestContext: APIRequestContext;
  private readonly baseUrl: string =
    'https://k51qryqov3.execute-api.ap-southeast-2.amazonaws.com';

  constructor(apiRequestContext: APIRequestContext) {
    this.apiRequestContext = apiRequestContext;
  }

  async getToken(username: string, password: string): Promise<string> {
    const response: APIResponse = await this.apiRequestContext.post(
      this.baseUrl + '/prod/oauth/token',
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
