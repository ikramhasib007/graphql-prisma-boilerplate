import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, login, getUsers, getProfile } from './utils/operations';

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
  const variables = {
    data: {
      name: 'Ikram Hasib',
      email: 'ikramhasib008@gmail.com',
      password: 'Nopass123'
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
  expect(response.data.users[0].name).toBe('john doe')
})

test('Should not login with bad credentials', async () => {
  const variables = {
    data: {
      email: 'ikahsfd@gmail.com',
      password: 'ewrewru098^'
    }
  }

  await expect(
    client.mutate({ mutation: login, variables })
  ).rejects.toThrow()
})

test('Should not signup with invalid password', async () => {
  const variables = {
    data: {
      name: 'ikram',
      email: 'ikramhasib007@gmail.com',
      password: 'Noss12'
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