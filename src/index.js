import server from './server';

server.start({ port: process.env.PORT }, () => {
  console.log(`Server is running on localhost:${process.env.PORT}`)
})
