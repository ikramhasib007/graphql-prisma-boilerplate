import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

export const userOne = {
  input: {
    name: 'john doe',
    email: 'johndoe@example.com',
    password: bcrypt.hashSync('Red089!#$', 10)
  },
  user: undefined,
  token: undefined
}

export const userTwo = {
  input: {
    name: 'Jane',
    email: 'jane@example.com',
    password: bcrypt.hashSync('Blue089!#$', 10)
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