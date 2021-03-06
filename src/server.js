import { GraphQLServer, PubSub } from 'graphql-yoga';
import { resolvers } from './resolvers';
import prisma from './prisma';


const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {
      request,
      prisma,
      pubsub,
    }
  },
})

export default server