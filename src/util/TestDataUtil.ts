import { faker } from '@faker-js/faker';

export function generateRegisterData() {
  const username: string = faker.internet.username();
  const firstName: string = faker.person.firstName();
  const lastName: string = faker.person.lastName();
  const password: string = 'Password123$';

  return { username, firstName, lastName, password };
}
