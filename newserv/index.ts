import { createServer } from './config/fastify.config';
import { registerGetRoutes } from './api/get.controller';
import {registerDynamicRoutes} from "./routes/dynamicRoutes";
import { registerPostRoutes } from './api/post.controller';
import { registerPutRoutes } from './api/put.controller';
import { registerDeleteRoutes } from './api/delete.controller';
import { registerPatchRoutes } from './api/patch.controller';
import {execSync} from "node:child_process";

const start = async () => {
    const fastify = createServer();

    // Registering the routes
    registerGetRoutes(fastify);
    registerPostRoutes(fastify);
    registerPutRoutes(fastify);
    registerDeleteRoutes(fastify);
    registerPatchRoutes(fastify);

    // Run the configure-routes.ts script
    console.log('\x1b[34m[INFO]\x1b[0m Running route configuration script...');
    execSync('npx ts-node ./scripts/configure-routes.ts', { stdio: 'inherit' });

    registerDynamicRoutes(fastify);

fastify.listen({port: 3000, host: '0.0.0.0'}, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`\x1b[32m[INFO]\x1b[0m Server started on ${address}`);
});
};

start()
    .then(() => console.log('Server started successfully'));
