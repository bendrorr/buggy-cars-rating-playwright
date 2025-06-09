import { APIRequestContext, APIResponse } from '@playwright/test';
import { BASE_URL_API } from '../config/BuggyCarsConstants.ts';

export class PopularMakeApi {
  constructor(
    private apiRequestContext: APIRequestContext,
    private token: string,
  ) {}

  private getAuthHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      Origin: 'https://buggy.justtestit.org',
      Referer: 'https://buggy.justtestit.org/',
      'accept-language': 'en-US,en;q=0.9,he;q=0.8',
    };
  }

  async getPopularMakes(makeId: string, page = 1): Promise<APIResponse> {
    return await this.apiRequestContext.get(
      `${BASE_URL_API}/prod/makes/${makeId}?modelsPage=${page}`,
      {
        headers: this.getAuthHeaders(),
      },
    );
  }
}
