import { FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';
import config from '../config/mockserver.config';
import { RouteConfig } from "../config/types/interfaces";
import {partition} from "../utils/partition";
import {generateSwaggerSchema} from "../utils/swagger-schema";

export const registerDynamicRoutes = (fastify: FastifyInstance) => {
    const dataDir = path.join(__dirname, config.dataDir);
    const routeConfigs = Object.entries(config.routeConfig).map(([file, routeConfig]) => ({
        file,
        routeConfig
    }));

    // Use the generic partition function to split into parent and nested routes
    const [nestedRoutes, parentRoutes] = partition(routeConfigs, ({ routeConfig }) => routeConfig.parents.length > 0);

    // Register parent routes
    parentRoutes.forEach(({ file, routeConfig }) => {
        const routeName = file.replace('.json', '');
        const routePath = `/${routeName}`;
        if (!isRouteRegistered(fastify, routePath)) {
            const dataFilePath = path.join(dataDir, file);
            registerRoutes(fastify, routeConfig.routes, routePath, dataFilePath, routeConfig);
        }
    });

    // Register nested routes
    nestedRoutes.forEach(({ file, routeConfig }) => {
        const routeName = file.replace('.json', '');
        const nestedRoutePath = generateNestedRoutePath(routeConfig.parents, routeName, routeConfig.customParentKeys);
        const dataFilePath = path.join(dataDir, file);
        if (!isRouteRegistered(fastify, nestedRoutePath)) {
            registerRoutes(fastify, routeConfig.routes, nestedRoutePath, dataFilePath, routeConfig);
        }
    });

    // After all routes are registered, print out the available routes
    fastify.ready(() => {
        fastify.log.info("All routes registered:");
        fastify.printRoutes();
    });
};
const isRouteRegistered = (fastify: FastifyInstance, routePath: string): boolean => {
    const routesList = fastify.printRoutes({ commonPrefix: false });
    return routesList.includes(routePath);
};

const generateNestedRoutePath = (parents: string[], routeName: string, customParentKeys: { [key: string]: string }): string => {
    const parentPaths = parents.map(parent => `${parent}/:${customParentKeys[parent] || `${parent}Id`}`).join('/');
    return `/${parentPaths}/${routeName}`;
};

const registerRoutes = (fastify: FastifyInstance, routes: string[], routePath: string, dataFilePath: string, config: RouteConfig) => {
    routes.forEach(route => {
        const { general: generalSchema, specific: specificSchema } = generateSwaggerSchema(route, routePath, path.parse(dataFilePath).name, config.hasSpecificRoute);
        switch (route) {
            case 'GET':
                fastify.get(routePath, { schema: generalSchema },async (request, reply) => {
                    if (simulateError(request, reply)) return;
                    const data = readDataFromFile(dataFilePath);
                    const filteredData = filterDataByQueryParams(data, request.query);
                    reply.status(200).send(filteredData);
                });
                fastify.log.info(`Registered GET route: ${routePath}`);

                if (config.hasSpecificRoute) {
                    const specificPath = `${routePath}/:id`;
                    fastify.get(specificPath, { schema: specificSchema },async (request, reply) => {
                        if (simulateError(request, reply)) return;
                        const data = readDataFromFile(dataFilePath);
                        // @ts-ignore
                        const item = findItemById(data, request.params.id);
                        reply.status(item ? 200 : 404).send(item || { error: 'Item not found' });
                    });
                    fastify.log.info(`Registered GET route: ${specificPath}`);
                }
                break;

            case 'POST':
                fastify.post(routePath, { schema: generalSchema },async (request, reply) => {
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
                fastify.put(`${routePath}/:id`, { schema: specificSchema },async (request, reply) => {
                    if (simulateError(request, reply)) return;
                    const data = readDataFromFile(dataFilePath);
                    // @ts-ignore
                    const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
                    if (itemIndex === -1) {
                        reply.status(404).send({ error: 'Item not found' });
                        return;
                    }
                    // Replace the entire item with the new data
                    // @ts-ignore
                    const updatedItem = { id: data[itemIndex].id, ...request.body };
                    data[itemIndex] = updatedItem;
                    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                    reply.status(200).send(updatedItem);
                });
                fastify.log.info(`Registered PUT route: ${routePath}/:id`);
                break;

            case 'PATCH':
                fastify.patch(`${routePath}/:id`, { schema: specificSchema },async (request, reply) => {
                    if (simulateError(request, reply)) return;
                    const data = readDataFromFile(dataFilePath);
                    // @ts-ignore
                    const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
                    if (itemIndex === -1) {
                        reply.status(404).send({ error: 'Item not found' });
                        return;
                    }
                    // Update only specific fields
                    // @ts-ignore
                    const updatedItem = { ...data[itemIndex], ...request.body };
                    data[itemIndex] = updatedItem;
                    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                    reply.status(200).send(updatedItem);
                });
                fastify.log.info(`Registered PATCH route: ${routePath}/:id`);
                break;

            case 'DELETE':
                fastify.delete(`${routePath}/:id`, { schema: specificSchema },async (request, reply) => {
                    if (simulateError(request, reply)) return;
                    const data = readDataFromFile(dataFilePath);
                    // @ts-ignore
                    const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
                    if (itemIndex === -1) {
                        reply.status(404).send({ error: 'Item not found' });
                        return;
                    }
                    // Remove the item from the data array
                    data.splice(itemIndex, 1);
                    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
                    reply.status(204).send();
                });
                fastify.log.info(`Registered DELETE route: ${routePath}/:id`);
                break;
        }
    });
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
