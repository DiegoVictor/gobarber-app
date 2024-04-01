import { faker } from '@faker-js/faker';
import factory from 'factory-girl';

factory.define(
  'User',
  {},
  {
    id: () => String(faker.number.int()),
    name: faker.person.fullName,
    avatar_url: faker.image.url,
    email: faker.internet.email,
    password: faker.internet.password,
  },
);

factory.define(
  'Provider',
  {},
  {
    id: () => String(faker.number.int()),
    name: faker.person.fullName,
    avatar_url: faker.image.url,
  },
);

export default factory;
