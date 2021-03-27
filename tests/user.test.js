import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, login, getUsers, getProfile } from './utils/operations';
import faker from 'faker';

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
  const variables = {
    data: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(8)
    }
  }
  
  const { data } = await client.mutate({
    mutation: createUser, variables
  })
  const user = await prisma.user.findUnique({ where: { id: data.createUser.user.id } })
  expect(user.id).toBe(data.createUser.user.id)
})

test('Should expose public author profiles', async () => {
  const response = await client.query({ query: getUsers })
  expect(response.data.users.length).toBe(2);
  expect(response.data.users[0].email).toBe(null);
})

test('Should not login with bad credentials', async () => {
  const variables = {
    data: {
      email: faker.name.findName(),
      password: faker.random.alphaNumeric(6)
    }
  }

  await expect(
    client.mutate({ mutation: login, variables })
  ).rejects.toThrow()
})

test('Should not signup with invalid password', async () => {
  const variables = {
    data: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(4)
    }
  }
  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow()
})

test('Should fetch user profile', async () => {
  const client = getClient(userOne.token)
  const { data } = await client.query({ query: getProfile })
  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
  expect(data.me.email).toBe(userOne.user.email)
})