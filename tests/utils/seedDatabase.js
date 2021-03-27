import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'
import faker from 'faker'

export const userOne = {
  input: {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync(faker.random.alphaNumeric(), 10)
  },
  user: undefined,
  token: undefined
}

export const userTwo = {
  input: {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync(faker.random.alphaNumeric(8), 10)
  },
  user: undefined,
  token: undefined
}

const seedDatabase = async () => {
  // Delete all data
  const deleteUsers = prisma.user.deleteMany();
  await prisma.$transaction([deleteUsers]);

  // Create userOne & generate auth token
  userOne.user = await prisma.user.create({
    data: userOne.input
  });
  userOne.token = jwt.sign({userId: userOne.user.id}, process.env.JWT_SECRET)

  // Create userTwo & generate auth token
  userTwo.user = await prisma.user.create({
    data: userTwo.input
  });
  userTwo.token = jwt.sign({userId: userTwo.user.id}, process.env.JWT_SECRET)

}

export default seedDatabase