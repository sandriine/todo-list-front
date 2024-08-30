// @ts-ignore
import fp from 'fastify-plugin';
import {FastifyInstance, FastifyPluginOptions} from 'fastify';
import fs from 'fs';
import path from 'path';
import config from '../config/mockserver.config';
import {RouteConfig} from '../config/types/interfaces';

const configureRoutesPlugin = async (fastify: FastifyInstance, _: FastifyPluginOptions) => {
    fastify.log.info('[INFO] Running route configuration script...');

    const dataDir = path.join(__dirname, config.dataDir);
    const files = fs.readdirSync(dataDir);

    files.forEach((file) => {
        if (path.extname(file) !== '.json') {
            fastify.log.info(`[INFO] Skipping non-JSON file: ${file}`);
            return;
        }

        if (!config.routeConfig[file]) {
            fastify.log.info(`[INFO] Found new file: ${file}`);
            addDefaultRouteConfig(file, fastify);
        }
    });

    fastify.log.info('[INFO] Configuration complete!');
};

const addDefaultRouteConfig = (file: string, fastify: FastifyInstance) => {
    config.routeConfig[file] = {
        routes: ['GET'],
        parents: [],
        customParentKeys: {},
        hasSpecificRoute: false,
    };

    try {
        writeConfigToFile(fastify);
    } catch (error) {
        // @ts-ignore
        fastify.log.error(`[ERROR] Failed to write configuration file: ${error.message}`);
    }
};

const writeConfigToFile = (fastify: FastifyInstance) => {
    const sortedRouteConfig = Object.keys(config.routeConfig)
        .sort()
        .reduce((acc, key) => {
            acc[key] = config.routeConfig[key];
            return acc;
        }, {} as typeof config.routeConfig);

    const configString = generateConfigString(sortedRouteConfig);
    const configFilePath = path.join(__dirname, '../config/mockserver.config.ts');

    try {
        fs.writeFileSync(configFilePath, configString, 'utf-8');
        fastify.log.info(`[INFO] Configuration file written to ${configFilePath}`);
    } catch (error) {
        // @ts-ignore
        fastify.log.error(`[ERROR] Failed to write configuration file: ${error.message}`);
    }
};

const generateConfigString = (sortedRouteConfig: { [key: string]: RouteConfig }): string => {
    return `import {MockServerConfig} from "./types/interfaces";

const config: MockServerConfig = {
    dataDir: '${config.dataDir}', // Directory where JSON files are stored
    routeConfig: {
        ${Object.entries(sortedRouteConfig).map(([key, value]) => `
        '${key}': {
            routes: [${value.routes.map(route => `'${route}'`).join(', ')}],
            parents: [${value.parents.map(parent => `'${parent}'`).join(', ')}],
            customParentKeys: {${Object.entries(value.customParentKeys).map(([parent, key]) => `'${parent}': '${key}'`).join(', ')}},
            hasSpecificRoute: ${value.hasSpecificRoute}
        }`).join(',')}
    }
};

export default config;`;
};

export default fp(configureRoutesPlugin);