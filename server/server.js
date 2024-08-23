const cors = require('@fastify/cors');
const fastify = require('fastify')({
  logger: true
})

fastify.register(cors, {
  origin: '*',
})

fastify.get('/todos', function (request, reply) {
  reply.send([{ id: '1', title: 'Hello'}])
})

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})