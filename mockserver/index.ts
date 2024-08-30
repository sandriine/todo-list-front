import { createServer } from './config/fastify.config';
import { registerGetRoutes } from './api/get.controller';
import {registerDynamicRoutes} from "./routes/dynamicRoutes";
import { registerPostRoutes } from './api/post.controller';
import { registerPutRoutes } from './api/put.controller';
import { registerDeleteRoutes } from './api/delete.controller';
import { registerPatchRoutes } from './api/patch.controller';
import configureRoutesPlugin from "./plugins/configureRoutesPlugin";

const start = async () => {
    const fastify = createServer();

    // Registering the routes
    registerGetRoutes(fastify);
    registerPostRoutes(fastify);
    registerPutRoutes(fastify);
    registerDeleteRoutes(fastify);
    registerPatchRoutes(fastify);

    await fastify.register(configureRoutesPlugin);

    registerDynamicRoutes(fastify);

fastify.listen({port: 3000, host: 'localhost'}, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`\x1b[32m[INFO]\x1b[0m Server started on ${address}`);
});
};

start()
    .then(() => console.log('Server started successfully'));
