import { FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';
import config from '../config/mockserver.config';
import { RouteConfig } from "../config/types/interfaces";

export const registerDynamicRoutes = (fastify: FastifyInstance) => {
    const dataDir = path.join(__dirname, config.dataDir);
    const files = fs.readdirSync(dataDir);

    files.forEach((file) => {
        if (path.extname(file) !== '.json') {
            fastify.log.info(`Skipping non-JSON file: ${file}`);
            return;
        }

        const routeName = path.basename(file, '.json');
        const dataFilePath = path.join(dataDir, file);
        const routeConfig = getRouteConfig(file);

        if (routeConfig.parents.length > 0) {
            const nestedRoutePath = generateNestedRoutePath(routeConfig.parents, routeName, routeConfig.customParentKeys);
            if (!isRouteRegistered(fastify, nestedRoutePath)) {
                registerRoutes(fastify, routeConfig.routes, nestedRoutePath, dataFilePath, routeConfig);
            }
        } else {
            const routePath = `/${routeName}`;
            if (!isRouteRegistered(fastify, routePath)) {
                registerRoutes(fastify, routeConfig.routes, routePath, dataFilePath, routeConfig);
            }
        }
    });
};

const getRouteConfig = (file: string): RouteConfig => {
    const routeConfig = config.routeConfig[file];
    if (!routeConfig) {
        throw new Error(`No routeConfig found for ${file}`);
    }
    return routeConfig;
};

const generateNestedRoutePath = (parents: string[], baseRoute: string, customKeys: { [parent: string]: string }): string => {
    const parentPaths = parents.map(parent => `:${customKeys[parent] || `${parent}Id`}`).join('/');
    return `/${parentPaths}/${baseRoute}/:id`;
};

const isRouteRegistered = (fastify: FastifyInstance, routePath: string): boolean => {
    const routesList = fastify.printRoutes({ commonPrefix: false });
    return routesList.includes(routePath);
};

const registerRoutes = (fastify: FastifyInstance, routes: string[], routePath: string, dataFilePath: string, config: RouteConfig) => {
    routes.forEach(route => {
        switch (route) {
            case 'GET':
                registerRoute(fastify, 'GET', routePath, async (request, reply) => {
                    const data = readDataFromFile(dataFilePath);
                    const filteredData = filterDataByQueryParams(data, request.query);
                    reply.status(200).send(filteredData);
                });
                if (config.hasSpecificRoute) {
                    registerRoute(fastify, 'GET', `${routePath}/:id`, async (request, reply) => {
                        const data = readDataFromFile(dataFilePath);
                        const item = findItemById(data, request.params.id);
                        reply.status(item ? 200 : 404).send(item || { error: 'Item not found' });
                    });
                }
                break;
            case 'POST':
                registerRoute(fastify, 'POST', routePath, async (request, reply) => {
                    const data = readDataFromFile(dataFilePath);
                    const newItem = { id: data.length + 1, ...request.body };
                    data.push(newItem);
                    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                    reply.status(201).send(newItem);
                });
                break;
            case 'PUT':
                registerRoute(fastify, 'PUT', `${routePath}/:id`, async (request, reply) => {
                    const data = readDataFromFile(dataFilePath);
                    const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
                    if (itemIndex === -1) {
                        reply.status(404).send({ error: 'Item not found' });
                        return;
                    }
                    data[itemIndex] = { id: data[itemIndex].id, ...request.body };
                    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                    reply.status(200).send(data[itemIndex]);
                });
                break;
            case 'PATCH':
                registerRoute(fastify, 'PATCH', `${routePath}/:id`, async (request, reply) => {
                    const data = readDataFromFile(dataFilePath);
                    const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
                    if (itemIndex === -1) {
                        reply.status(404).send({ error: 'Item not found' });
                        return;
                    }
                    data[itemIndex] = { ...data[itemIndex], ...request.body };
                    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                    reply.status(200).send(data[itemIndex]);
                });
                break;
            case 'DELETE':
                registerRoute(fastify, 'DELETE', `${routePath}/:id`, async (request, reply) => {
                    const data = readDataFromFile(dataFilePath);
                    const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
                    if (itemIndex === -1) {
                        reply.status(404).send({ error: 'Item not found' });
                        return;
                    }
                    data.splice(itemIndex, 1);
                    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                    reply.status(204).send();
                });
                break;
        }
    });
};

const registerRoute = (fastify: FastifyInstance, method: string, path: string, handler: (request: any, reply: any) => Promise<void>) => {
    fastify.route({
        method: method as any,
        url: path,
        handler: async (request, reply) => {
            if (simulateError(request, reply)) return;
            await handler(request, reply);
        },
    });
    fastify.log.info(`Registered ${method} route: ${path}`);
};

const simulateError = (request: any, reply: any): boolean => {
    const errorType = request.query.errorType;
    if (errorType) {
        switch (errorType) {
            case '404':
                reply.status(404).send({ error: 'Not Found' });
                break;
            case '500':
                reply.status(500).send({ error: 'Server Error' });
                break;
            case '401':
                reply.status(401).send({ error: 'Unauthorized' });
                break;
            case '403':
                reply.status(403).send({ error: 'Forbidden' });
                break;
            default:
                reply.status(400).send({ error: 'Bad Request' });
        }
        return true;
    }
    return false;
};

const readDataFromFile = (filePath: string) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const filterDataByQueryParams = (data: any[], queryParams: any) => {
    if (!queryParams) return data;
    return data.filter((item: any) => {
        return Object.keys(queryParams).every(key => item[key] == queryParams[key]);
    });
};

const findItemById = (data: any[], id: string) => {
    return data.find((item: any) => String(item.id) === String(id));
};
