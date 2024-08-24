import { FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';

export const registerDynamicRoutes = (fastify: FastifyInstance) => {
    const dataDir = path.join(__dirname, '../data');
    const files = fs.readdirSync(dataDir);

    files.forEach((file) => {
        const routePath = `/${path.basename(file, '.json')}`;

        // Check if the route is already registered
        const existingRoute = fastify.printRoutes({ commonPrefix: false }).includes(routePath);

        if (!existingRoute) {
            fastify.get(routePath, async (request, reply) => {
                const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
                const queryParams = request.query;

                // Implement filtering based on query parameters
                let filteredData = data;
                if (queryParams) {
                    filteredData = data.filter((item: any) => {
                        // @ts-ignore
                        return Object.keys(queryParams).every(key => item[key] == queryParams[key]);
                    });
                }

                reply.status(200).send(filteredData);
            });

            fastify.log.info(`Registered route: ${routePath}`);
        } else {
            fastify.log.info(`Route ${routePath} already exists. Skipping registration.`);
        }
    });
};
