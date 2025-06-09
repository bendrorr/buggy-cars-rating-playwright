import { APIRequestContext, APIResponse } from '@playwright/test';
import { BASE_URL_API } from '../config/BuggyCarsConstants.ts';

export class ProfileApi {
  constructor(
    private apiRequestContext: APIRequestContext,
    private token: string,
  ) {}

  async getProfile(): Promise<any> {
    const response: APIResponse = await this.apiRequestContext.get(
      BASE_URL_API + '/prod/users/profile',
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
    if (!response.ok()) {
      throw new Error(`Failed to get profile: ${response.status()}`);
    }
    return await response.json();
  }

  async updateProfile(profileData: {
    username: string;
    firstName: string;
    lastName: string;
    gender?: string;
    age?: string;
    address?: string;
    phone?: string;
    hobby?: string;
    currentPassword?: string;
    newPassword?: string;
    newPasswordConfirmation?: string;
  }): Promise<APIResponse> {
    return await this.apiRequestContext.put(
      BASE_URL_API + '/prod/users/profile',
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          Origin: 'https://buggy.justtestit.org',
          Referer: 'https://buggy.justtestit.org/',
        },
        data: {
          username: profileData.username,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          gender: profileData.gender ?? '',
          age: profileData.age ?? '',
          address: profileData.address ?? '',
          phone: profileData.phone ?? '',
          hobby: profileData.hobby ?? '',
          currentPassword: profileData.currentPassword ?? '',
          newPassword: profileData.newPassword ?? '',
          newPasswordConfirmation: profileData.newPasswordConfirmation ?? '',
        },
      },
    );
  }
}
