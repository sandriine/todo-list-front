import { createServer } from './config/fastify.config';
import { registerGetRoutes } from './api/get.controller';
import {registerDynamicRoutes} from "./routes/dynamicRoutes";
import { registerPostRoutes } from './api/post.controller';
import { registerPutRoutes } from './api/put.controller';
import { registerDeleteRoutes } from './api/delete.controller';
import { registerPatchRoutes } from './api/patch.controller';

const start = async () => {
    const fastify = createServer();

    // Registering the routes
    registerGetRoutes(fastify);
    registerPostRoutes(fastify);
    registerPutRoutes(fastify);
    registerDeleteRoutes(fastify);
    registerPatchRoutes(fastify);
    registerDynamicRoutes(fastify);

    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        fastify.log.info(`Server listening on http://localhost:3000`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start()
    .then(() => console.log('Server started'));
