import createError from "../utils/createError";
import getUserId from "../utils/getUserId";

const Query = {
  users(parent, args, { prisma, request }, info) {
    try {
      const opArgs = {
        take: args.take,
        skip: args.skip
      };
      if(typeof args.cursor === 'string') {
        opArgs.cursor = {
          id: args.cursor
        }
      }
      if(args.query) {
        opArgs.where = {
          OR: [{
            name: {
              contains: args.query
            }
          }]
        }
      }
      return prisma.user.findMany(opArgs)
    } catch (error) {
      return createError.BadRequest(error)
    }
  },
  me(parent, args, { prisma, request }, info) {
    try {
      const userId = getUserId(request);
      return prisma.user.findUnique({
        where: {
          id: userId
        }
      })
    } catch (error) {
      return createError.BadRequest(error)
    }
  }
}
export default Query