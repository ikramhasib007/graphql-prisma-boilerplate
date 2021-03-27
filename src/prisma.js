import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  rejectOnNotFound: {
    findUnique: {
      User: err => new Error('User error')
    },
    findFirst: {
      User: err => new Error('User error')
    },
  }
})

export default prisma