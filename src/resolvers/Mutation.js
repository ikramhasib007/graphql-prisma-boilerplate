import bcrypt from 'bcryptjs';
import createError from '../utils/createError';
import generateToken from '../utils/generateToken';
import getUserId from '../utils/getUserId';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    try {
      const password = await hashPassword(args.data.password);
      const user = await prisma.user
      .create({
        data: {
          ...args.data,
          password
        }
      });

      return {
        user,
        token: generateToken(user.id)
      }
    } catch (error) {
      return createError.BadRequest(error)
    }
  },

  async login(parent, args, { prisma }, info) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: args.data.email
        }
      });
  
      const isMatch = await bcrypt.compare(args.data.password, user.password)
      if(!isMatch) throw new Error('Unable to login')
  
      return {
        user,
        token: generateToken(user.id)
      }
    } catch (error) {
      return createError.BadRequest(error)
    }
  },

  async updateUser(parent, args, { prisma, request }, info) {
    try {
      const userId = getUserId(request)
      if(typeof args.data.password === 'string') {
        args.data.password = await hashPassword(args.data.password)
      }
      return prisma.user.update({
        where: {
          id: userId
        },
        data: args.data
      }, info)
    } catch (error) {
      return createError.BadRequest(error)
    }
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    try {
      const userId = getUserId(request);
      const deleteUser = prisma.user.delete({
        where: {
          id: userId
        }
      })
      // CASECADE delete implements with transaction API
      const [user] = await prisma.$transaction([deleteUser]);
      return user;
    } catch (error) {
      return createError.BadRequest(error)
    }
  }
}

export default Mutation