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
        const routePath = `/${routeName}`;
        const dataFilePath = path.join(dataDir, file);

        const routeConfig: RouteConfig = config.routeConfig[file] || {
            routes: ['GET'],
            parents: [],
            customParentKeys: {},
            hasSpecificRoute: false
        };

        if (!routeConfig) {
            console.error(`No routeConfig found for ${file}`);
            return;
        }

        if (routeConfig.parents.length > 0) {
            const nestedRoutePath = generateNestedRoutePath(routeConfig.parents, routeName, routeConfig.customParentKeys);
            if (!isRouteRegistered(fastify, nestedRoutePath)) {
                registerNestedRoutes(fastify, routeConfig, nestedRoutePath, dataFilePath);
            }
        } else {
            if (!isRouteRegistered(fastify, routePath)) {
                registerRoutes(fastify, routeConfig.routes, routePath, dataFilePath, routeConfig);
            }
        }
    });
};

const isRouteRegistered = (fastify: FastifyInstance, routePath: string): boolean => {
    const routesList = fastify.printRoutes({ commonPrefix: false });
    return routesList.includes(routePath);
};

const generateNestedRoutePath = (parents: string[], routeName: string, customParentKeys: { [key: string]: string }): string => {
    const parentPaths = parents.map(parent => `:${customParentKeys[parent] || `${parent}Id`}`).join('/');
    return `/${parentPaths}/${routeName}`;
};

const registerRoutes = (fastify: FastifyInstance, routes: string[], routePath: string, dataFilePath: string, config: RouteConfig) => {
    routes.forEach(route => {
        switch (route) {
            case 'GET':
                fastify.get(routePath, async (request, reply) => {
                    if (simulateError(request, reply)) return;
                    const data = readDataFromFile(dataFilePath);
                    const filteredData = filterDataByQueryParams(data, request.query);
                    reply.status(200).send(filteredData);
                });
                fastify.log.info(`Registered GET route: ${routePath}`);

                if (config.hasSpecificRoute) {
                    fastify.get(`${routePath}/:id`, async (request, reply) => {
                        if (simulateError(request, reply)) return;
                        const data = readDataFromFile(dataFilePath);
                        // @ts-ignore
                        const item = findItemById(data, request.params.id);
                        reply.status(item ? 200 : 404).send(item || { error: 'Item not found' });
                    });
                    fastify.log.info(`Registered GET route: ${routePath}/:id`);
                }
                break;

            case 'POST':
                fastify.post(routePath, async (request, reply) => {
                    if (simulateError(request, reply)) return;
                    const data = readDataFromFile(dataFilePath);
                    const newItem = request.body;
                    // @ts-ignore
                    newItem.id = data.length + 1;
                    data.push(newItem);
                    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                    reply.status(201).send(newItem);
                });
                fastify.log.info(`Registered POST route: ${routePath}`);
                break;

            case 'PUT':
                fastify.put(`${routePath}/:id`, async (request, reply) => {
                    if (simulateError(request, reply)) return;
                    const data = readDataFromFile(dataFilePath);
                    // @ts-ignore
                    const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
                    if (itemIndex === -1) {
                        reply.status(404).send({ error: 'Item not found' });
                        return;
                    }
                    // @ts-ignore
                    const updatedItem = { id: data[itemIndex].id, ...request.body };
                    data[itemIndex] = updatedItem;
                    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                    reply.status(200).send(updatedItem);
                });
                fastify.log.info(`Registered PUT route: ${routePath}/:id`);
                break;

            case 'PATCH':
                fastify.patch(`${routePath}/:id`, async (request, reply) => {
                    if (simulateError(request, reply)) return;
                    const data = readDataFromFile(dataFilePath);
                    // @ts-ignore
                    const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
                    if (itemIndex === -1) {
                        reply.status(404).send({ error: 'Item not found' });
                        return;
                    }
                    // @ts-ignore
                    data[itemIndex] = { ...data[itemIndex], ...request.body };
                    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                    reply.status(200).send(data[itemIndex]);
                });
                fastify.log.info(`Registered PATCH route: ${routePath}/:id`);
                break;

            case 'DELETE':
                fastify.delete(`${routePath}/:id`, async (request, reply) => {
                    if (simulateError(request, reply)) return;
                    const data = readDataFromFile(dataFilePath);
                    // @ts-ignore
                    const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
                    if (itemIndex === -1) {
                        reply.status(404).send({ error: 'Item not found' });
                        return;
                    }
                    data.splice(itemIndex, 1);
                    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                    reply.status(204).send();
                });
                fastify.log.info(`Registered DELETE route: ${routePath}/:id`);
                break;
        }
    });
};

const registerNestedRoutes = (
    fastify: FastifyInstance,
    config: RouteConfig,
    nestedRoutePath: string,
    dataFilePath: string
) => {
    registerRoutes(fastify, config.routes, nestedRoutePath, dataFilePath, config);
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
