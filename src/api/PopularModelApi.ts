import { APIRequestContext, APIResponse } from '@playwright/test';
import { BASE_URL_API } from '../config/BuggyCarsConstants.ts';

export class PopularModelApi {
  constructor(
    private apiRequestContext: APIRequestContext,
    private token: string,
  ) {}

  private getAuthHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      Origin: 'https://buggy.justtestit.org',
      Referer: 'https://buggy.justtestit.org/',
    };
  }

  async getAllModels(): Promise<APIResponse> {
    return await this.apiRequestContext.get(BASE_URL_API + '/prod/models/', {
      headers: this.getAuthHeaders(),
    });
  }

  async getModelById(compositeId: string): Promise<APIResponse> {
    const encodedId = encodeURIComponent(compositeId);
    const url = `${BASE_URL_API}/prod/models/${encodedId}`;

    return await this.apiRequestContext.get(url, {
      headers: this.getAuthHeaders(),
    });
  }
}
