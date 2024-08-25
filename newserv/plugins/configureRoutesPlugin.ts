// @ts-ignore
import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fs from 'fs';
import path from 'path';
import config from '../config/mockserver.config';

const configureRoutesPlugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.log.info('[INFO] Running route configuration script...');

    const dataDir = path.join(__dirname, config.dataDir);
    const files = fs.readdirSync(dataDir);

    files.forEach((file) => {
        // Skip non-JSON files, such as README.md
        if (path.extname(file) !== '.json') {
            fastify.log.info(`[INFO] Skipping non-JSON file: ${file}`);
            return;
        }

        if (!config.routeConfig[file]) {
            fastify.log.info(`[INFO] Found new file: ${file}`);

            // Default configuration: only GET method without specific routes
            config.routeConfig[file] = {
                routes: ['GET'],
                parent: null,
                parentKey: null,
                hasSpecificRoute: false,
            };

            const configString = `import {MockServerConfig} from "./types/interfaces";
    
const config: MockServerConfig = {
    dataDir: '${config.dataDir}', // Directory where JSON files are stored
    routeConfig: {
        ${Object.entries(config.routeConfig).map(([key, value]) => `
        '${key}': {
            routes: [${value.routes.map(route => `'${route}'`).join(', ')}],
            parent: ${value.parent ? `'${value.parent}'` : 'null'},
            parentKey: ${value.parentKey ? `'${value.parentKey}'` : 'null'},
            hasSpecificRoute: ${value.hasSpecificRoute}
        }`).join(',')}
    }
};

export default config;`;

            fs.writeFileSync(path.join(__dirname, '../config/mockserver.config.ts'), configString, 'utf-8');
            fastify.log.info(`[INFO] Added default GET route configuration for ${file}`);
        }
    });

    fastify.log.info('[INFO] Configuration complete!');
};

export default fp(configureRoutesPlugin);