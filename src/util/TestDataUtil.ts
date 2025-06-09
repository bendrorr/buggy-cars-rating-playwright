import { faker } from '@faker-js/faker';
import { UserCredentials } from '../model/UserCredentials.ts';

export function generateRegisterData(): UserCredentials {
  const username: string = faker.internet.username();
  const firstName: string = faker.person.firstName();
  const lastName: string = faker.person.lastName();
  const password: string = 'Password123$';
  const confirmPassword: string = password;
  return { username, firstName, lastName, password, confirmPassword };
}
