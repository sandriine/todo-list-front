

// const routeConfig = {
//     //'me.json': { hasSpecificRoute: false },
//     //'todo_items.json': { parent: 'todos', parentKey: 'todoId', hasSpecificRoute: true },
//     // Add more files as needed with specific configurations
// };

    // 'todo_items.json': {
    //     routes: ['GET'], // Only register GET routes
    //     parent: 'todos',
    //     parentKey: 'todoId',
    //     hasSpecificRoute: true
    // },
    // 'me.json': {
    //     routes: ['GET'], // Only a single GET route
    //     hasSpecificRoute: false
    // },
    // Add more files as needed


//
// export const registerDynamicRoutes = (fastify: FastifyInstance) => {
//     const dataDir = path.join(__dirname, '../data');
//     const files = fs.readdirSync(dataDir);
//
//     files.forEach((file) => {
//         const routeName = path.basename(file, '.json');
//         const routePath = `/${routeName}`;
//         const dataFilePath = path.join(dataDir, file);
//
//         // Check if the route is already registered
//         if (isRouteRegistered(fastify, routePath)) {
//             fastify.log.info(`Route ${routePath} already exists. Skipping registration.`);
//             return;
//         }
//
//         // @ts-ignore
//         const config = routeConfig[file] || { hasSpecificRoute: true };
//
//         // Register standard routes
//         registerStandardRoutes(fastify, routePath, dataFilePath, config);
//
//         // Register nested routes if applicable
//         if (config.parent) {
//             fastify.log.info(`Config found for nested route: ${file} under parent ${config.parent}`);
//             registerNestedRoutes(fastify, config, routeName, dataFilePath);
//         }
//     });
// };
//
// const isRouteRegistered = (fastify: FastifyInstance, routePath: string): boolean => {
//     // const isRegistered = fastify.printRoutes({ commonPrefix: false }).includes(routePath);
//     // fastify.log.info(`Checking if route ${routePath} is already registered: ${isRegistered}`);
//     // return isRegistered;
//
//     const routesList = fastify.printRoutes({ commonPrefix: false });
//     const isRegistered = routesList.includes(routePath);
//
//     fastify.log.info(`Checking if route ${routePath} is already registered: ${isRegistered}`);
//     fastify.log.debug(`Current registered routes: ${routesList}`);
//
//     return isRegistered;
// };
//
// const registerStandardRoutes = (
//     fastify: FastifyInstance,
//     routePath: string,
//     dataFilePath: string,
//     config: { hasSpecificRoute: boolean }
// ) => {
//     // Route for retrieving all items
//     fastify.get(routePath, async (request, reply) => {
//         fastify.log.info(`Handling GET ${routePath}`);
//         const data = readDataFromFile(dataFilePath);
//         const filteredData = filterDataByQueryParams(data, request.query);
//         reply.status(200).send(filteredData);
//     });
//     fastify.log.info(`Registered route: ${routePath}`);
//
//     // Route for retrieving a specific item by ID
//     if (config.hasSpecificRoute) {
//         fastify.get(`${routePath}/:id`, async (request, reply) => {
//             fastify.log.info(`Handling GET ${routePath}/:id`);
//             const data = readDataFromFile(dataFilePath);
//             // @ts-ignore
//             const item = findItemById(data, request.params.id);
//             if (!item) {
//                 // @ts-ignore
//                 fastify.log.warn(`Item not found for ID: ${request.params.id} at ${routePath}`);
//                 reply.status(404).send({ error: 'Item not found' });
//             } else {
//                 reply.status(200).send(item);
//             }
//         });
//         fastify.log.info(`Registered route: ${routePath}/:id`);
//     } else {
//         fastify.log.info(`Skipped specific route for ${routePath} due to config.`);
//     }
// };
//
// const registerNestedRoutes = (
//     fastify: FastifyInstance,
//     config: { parent: string; parentKey: string; hasSpecificRoute: boolean },
//     routeName: string,
//     dataFilePath: string
// ) => {
//     const parentRouteName = config.parent;
//     const parentKey = config.parentKey;
//
//     // Route to get all items related to a specific parent
//     fastify.get(`/${parentRouteName}/:${parentKey}/${routeName}`, async (request, reply) => {
//         fastify.log.info(`Handling GET /${parentRouteName}/:${parentKey}/${routeName}`);
//         // @ts-ignore
//         const parentId = request.params[parentKey];
//         const data = readDataFromFile(dataFilePath);
//         const filteredData = data.filter((item: any) => String(item[parentKey]) === String(parentId));
//
//         if (filteredData.length === 0) {
//             fastify.log.warn(`Items not found for parent ID: ${parentId} at /${parentRouteName}/:${parentKey}/${routeName}`);
//             reply.status(404).send({ error: 'Items not found' });
//         } else {
//             reply.status(200).send(filteredData);
//         }
//     });
//     fastify.log.info(`Registered nested route: /${parentRouteName}/:${parentKey}/${routeName}`);
//
//     // Route to get a specific item related to a specific parent
//     if (config.hasSpecificRoute) {
//         fastify.get(`/${parentRouteName}/:${parentKey}/${routeName}/:id`, async (request, reply) => {
//             fastify.log.info(`Handling GET /${parentRouteName}/:${parentKey}/${routeName}/:id`);
//             // @ts-ignore
//             const parentId = request.params[parentKey];
//             // @ts-ignore
//             const itemId = request.params.id;
//             const data = readDataFromFile(dataFilePath);
//             const item = data.find((item: any) =>
//                 String(item[parentKey]) === String(parentId) && String(item.id) === String(itemId)
//             );
//
//             if (!item) {
//                 fastify.log.warn(`Item not found for parent ID: ${parentId} and item ID: ${itemId} at /${parentRouteName}/:${parentKey}/${routeName}/:id`);
//                 reply.status(404).send({ error: 'Item not found' });
//             } else {
//                 reply.status(200).send(item);
//             }
//         });
//         fastify.log.info(`Registered nested route: /${parentRouteName}/:${parentKey}/${routeName}/:id`);
//     } else {
//         fastify.log.info(`Skipped nested specific route for ${routeName} under parent ${parentRouteName} due to config.`);
//     }
// };
//
// const readDataFromFile = (filePath: string) => {
//     return JSON.parse(fs.readFileSync(filePath, 'utf8'));
// };
//
// const filterDataByQueryParams = (data: any[], queryParams: any) => {
//     if (!queryParams) return data;
//
//     return data.filter((item: any) => {
//         return Object.keys(queryParams).every(key => item[key] == queryParams[key]);
//     });
// };
//
// const findItemById = (data: any[], id: string) => {
//     return data.find((item: any) => String(item.id) === String(id));
// };

// import { FastifyInstance } from 'fastify';
// import fs from 'fs';
// import path from 'path';
//
// const routeConfig = {
//     'todos.json': {
//         routes: ['GET', 'POST', 'PUT', 'PATCH','DELETE'], // Register these routes
//         parent: null,
//         hasSpecificRoute: true
//     }
// };
// export const registerDynamicRoutes = (fastify: FastifyInstance) => {
//     const dataDir = path.join(__dirname, '../data');
//     const files = fs.readdirSync(dataDir);
//
//     files.forEach((file) => {
//         const routeName = path.basename(file, '.json');
//         const routePath = `/${routeName}`;
//         const dataFilePath = path.join(dataDir, file);
//
//         // @ts-ignore
//         const config = routeConfig[file] || { routes: ['GET'], hasSpecificRoute: true };
//
//         if (config.routes.includes('GET')) {
//             registerGetRoutes(fastify, routePath, dataFilePath, config);
//         }
//         if (config.routes.includes('POST')) {
//             registerPostRoute(fastify, routePath, dataFilePath);
//         }
//         if (config.routes.includes('PUT')) {
//             registerPutRoute(fastify, routePath, dataFilePath);
//         }
//         if (config.routes.includes('DELETE')) {
//             registerDeleteRoute(fastify, routePath, dataFilePath);
//         }
//         if (config.routes.includes('PATCH')) {
//             registerPatchRoute(fastify, routePath, dataFilePath);
//         }
//         if (config.parent) {
//             registerNestedRoutes(fastify, config, routeName, dataFilePath);
//         }
//     });
// };
//
// const registerGetRoutes = (fastify: FastifyInstance, routePath: string, dataFilePath: string, config: { hasSpecificRoute: boolean }) => {
//     fastify.get(routePath, async (request, reply) => {
//         const data = readDataFromFile(dataFilePath);
//         const filteredData = filterDataByQueryParams(data, request.query);
//         reply.status(200).send(filteredData);
//     });
//
//     if (config.hasSpecificRoute) {
//         fastify.get(`${routePath}/:id`, async (request, reply) => {
//             const data = readDataFromFile(dataFilePath);
//             // @ts-ignore
//             const item = findItemById(data, request.params.id);
//             if (!item) {
//                 reply.status(404).send({ error: 'Item not found' });
//             } else {
//                 reply.status(200).send(item);
//             }
//         });
//     }
// };
//
// const registerPostRoute = (fastify: FastifyInstance, routePath: string, dataFilePath: string) => {
//     fastify.post(routePath, async (request, reply) => {
//         const data = readDataFromFile(dataFilePath);
//         const newItem = request.body;
//         // @ts-ignore
//         newItem.id = data.length + 1; // Example of assigning a new ID
//         data.push(newItem);
//         fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
//         reply.status(201).send(newItem);
//     });
// };
//
// const registerPutRoute = (fastify: FastifyInstance, routePath: string, dataFilePath: string) => {
//     fastify.put(`${routePath}/:id`, async (request, reply) => {
//         const data = readDataFromFile(dataFilePath);
//         // @ts-ignore
//         const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
//         if (itemIndex === -1) {
//             reply.status(404).send({ error: 'Item not found' });
//             return;
//         }
//         // PUT replaces the entire item
//         // @ts-ignore
//         const updatedItem = { id: data[itemIndex].id, ...request.body };
//         data[itemIndex] = updatedItem;
//         fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
//         reply.status(200).send(updatedItem);
//     });
// };
//
// const registerPatchRoute = (fastify: FastifyInstance, routePath: string, dataFilePath: string) => {
//     fastify.patch(`${routePath}/:id`, async (request, reply) => {
//         const data = readDataFromFile(dataFilePath);
//         // @ts-ignore
//         const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
//         if (itemIndex === -1) {
//             reply.status(404).send({ error: 'Item not found' });
//             return;
//         }
//         // PATCH updates only specific fields
//         // @ts-ignore
//         data[itemIndex] = { ...data[itemIndex], ...request.body };
//         fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
//         reply.status(200).send(data[itemIndex]);
//     });
// };
//
// const registerDeleteRoute = (fastify: FastifyInstance, routePath: string, dataFilePath: string) => {
//     fastify.delete(`${routePath}/:id`, async (request, reply) => {
//         const data = readDataFromFile(dataFilePath);
//         // @ts-ignore
//         const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
//         if (itemIndex === -1) {
//             reply.status(404).send({ error: 'Item not found' });
//             return;
//         }
//         data.splice(itemIndex, 1);
//         fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
//         reply.status(204).send();
//     });
// };
//
// const registerNestedRoutes = (
//     fastify: FastifyInstance,
//     config: { parent: string; parentKey: string; hasSpecificRoute: boolean },
//     routeName: string,
//     dataFilePath: string
// ) => {
//     const parentRouteName = config.parent;
//     const parentKey = config.parentKey;
//
//     fastify.get(`/${parentRouteName}/:${parentKey}/${routeName}`, async (request, reply) => {
//         // @ts-ignore
//         const parentId = request.params[parentKey];
//         const data = readDataFromFile(dataFilePath);
//         const filteredData = data.filter((item: any) => String(item[parentKey]) === String(parentId));
//         reply.status(200).send(filteredData);
//     });
//
//     if (config.hasSpecificRoute) {
//         fastify.get(`/${parentRouteName}/:${parentKey}/${routeName}/:id`, async (request, reply) => {
//             // @ts-ignore
//             const parentId = request.params[parentKey];
//             // @ts-ignore
//             const itemId = request.params.id;
//             const data = readDataFromFile(dataFilePath);
//             const item = data.find((item: any) =>
//                 String(item[parentKey]) === String(parentId) && String(item.id) === String(itemId)
//             );
//             reply.status(item ? 200 : 404).send(item || { error: 'Item not found' });
//         });
//     }
// };
//
// const readDataFromFile = (filePath: string) => {
//     return JSON.parse(fs.readFileSync(filePath, 'utf8'));
// };
//
// const filterDataByQueryParams = (data: any[], queryParams: any) => {
//     if (!queryParams) return data;
//
//     return data.filter((item: any) => {
//         return Object.keys(queryParams).every(key => item[key] == queryParams[key]);
//     });
// };
//
// const findItemById = (data: any[], id: string) => {
//     return data.find((item: any) => String(item.id) === String(id));
// };
//////////////////////////////////////
// import { FastifyInstance } from 'fastify';
// import fs from 'fs';
// import path from 'path';
//
// const routeConfig = {
//     'todos.json': {
//         routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Register these routes
//         parent: null,
//         hasSpecificRoute: true
//     },
//     // 'todo_items.json': {
//     //     routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Register these routes for nested
//     //     parent: 'todos',
//     //     parentKey: 'todoId',
//     //     hasSpecificRoute: true
//     // }
// };
//
// export const registerDynamicRoutes = (fastify: FastifyInstance) => {
//     const dataDir = path.join(__dirname, '../data');
//     const files = fs.readdirSync(dataDir);
//
//     files.forEach((file) => {
//         const routeName = path.basename(file, '.json');
//         const routePath = `/${routeName}`;
//         const dataFilePath = path.join(dataDir, file);
//
//         // @ts-ignore
//         const config = routeConfig[file] || { routes: ['GET'], hasSpecificRoute: true };
//
//         registerRoutes(fastify, config.routes, routePath, dataFilePath, config);
//
//         if (config.parent) {
//             registerNestedRoutes(fastify, config, routeName, dataFilePath);
//         }
//     });
// };
//
// const registerRoutes = (fastify: FastifyInstance, routes: string[], routePath: string, dataFilePath: string, config?: { hasSpecificRoute: boolean }) => {
//     routes.forEach(route => {
//         switch (route) {
//             case 'GET':
//                 fastify.get(routePath, async (request, reply) => {
//                     const data = readDataFromFile(dataFilePath);
//                     const filteredData = filterDataByQueryParams(data, request.query);
//                     reply.status(200).send(filteredData);
//                 });
//                 fastify.log.info(`Registered GET route: ${routePath}`);
//
//                 if (config?.hasSpecificRoute) {
//                     fastify.get(`${routePath}/:id`, async (request, reply) => {
//                         const data = readDataFromFile(dataFilePath);
//                         // @ts-ignore
//                         const item = findItemById(data, request.params.id);
//                         reply.status(item ? 200 : 404).send(item || { error: 'Item not found' });
//                     });
//                     fastify.log.info(`Registered GET route: ${routePath}/:id`);
//                 }
//                 break;
//             case 'POST':
//                 fastify.post(routePath, async (request, reply) => {
//                     const data = readDataFromFile(dataFilePath);
//                     const newItem = request.body;
//                     // @ts-ignore
//                     newItem.id = data.length + 1; // Example of assigning a new ID
//                     data.push(newItem);
//                     fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
//                     reply.status(201).send(newItem);
//                 });
//                 fastify.log.info(`Registered POST route: ${routePath}`);
//                 break;
//             case 'PUT':
//                 fastify.put(`${routePath}/:id`, async (request, reply) => {
//                     const data = readDataFromFile(dataFilePath);
//                     // @ts-ignore
//                     const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
//                     if (itemIndex === -1) {
//                         reply.status(404).send({ error: 'Item not found' });
//                         return;
//                     }
//                     // PUT replaces the entire item
//                     // @ts-ignore
//                     const updatedItem = { id: data[itemIndex].id, ...request.body };
//                     data[itemIndex] = updatedItem;
//                     fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
//                     reply.status(200).send(updatedItem);
//                 });
//                 fastify.log.info(`Registered PUT route: ${routePath}/:id`);
//                 break;
//             case 'PATCH':
//                 fastify.patch(`${routePath}/:id`, async (request, reply) => {
//                     const data = readDataFromFile(dataFilePath);
//                     // @ts-ignore
//                     const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
//                     if (itemIndex === -1) {
//                         reply.status(404).send({ error: 'Item not found' });
//                         return;
//                     }
//                     // PATCH updates only specific fields
//                     // @ts-ignore
//                     data[itemIndex] = { ...data[itemIndex], ...request.body };
//                     fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
//                     reply.status(200).send(data[itemIndex]);
//                 });
//                 fastify.log.info(`Registered PATCH route: ${routePath}/:id`);
//                 break;
//             case 'DELETE':
//                 fastify.delete(`${routePath}/:id`, async (request, reply) => {
//                     const data = readDataFromFile(dataFilePath);
//                     // @ts-ignore
//                     const itemIndex = data.findIndex((item: any) => item.id == request.params.id);
//                     if (itemIndex === -1) {
//                         reply.status(404).send({ error: 'Item not found' });
//                         return;
//                     }
//                     data.splice(itemIndex, 1);
//                     fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
//                     reply.status(204).send();
//                 });
//                 fastify.log.info(`Registered DELETE route: ${routePath}/:id`);
//                 break;
//         }
//     });
// };
//
// interface RouteConfig {
//     routes: string[]; // Array of HTTP methods (e.g., ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
//     parent: string | null; // Parent route name or null if it's not a nested route
//     parentKey: string; // The key used to identify the parent in the nested route
//     hasSpecificRoute: boolean; // Whether or not to register specific routes (e.g., /:id)
// }
//
// const registerNestedRoutes = (
//     fastify: FastifyInstance,
//     config: RouteConfig,
//     routeName: string,
//     dataFilePath: string
// ) => {
//     const parentRouteName = config.parent;
//     const parentKey = config.parentKey;
//     const nestedRoutePath = `/${parentRouteName}/:${parentKey}/${routeName}`;
//
//     registerRoutes(fastify, config.routes, nestedRoutePath, dataFilePath, config);
// };
//
// const readDataFromFile = (filePath: string) => {
//     return JSON.parse(fs.readFileSync(filePath, 'utf8'));
// };
//
// const filterDataByQueryParams = (data: any[], queryParams: any) => {
//     if (!queryParams) return data;
//
//     return data.filter((item: any) => {
//         return Object.keys(queryParams).every(key => item[key] == queryParams[key]);
//     });
// };
//
// const findItemById = (data: any[], id: string) => {
//     return data.find((item: any) => String(item.id) === String(id));
// };
//////////////////////////////////////////////////

import { FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import config from '../mockserver.config.js';

// interface RouteConfig {
//     routes: string[];
//     parent: string | null;
//     parentKey: string;
//     hasSpecificRoute: boolean;
// }

/*const routeConfig = {
    'todos.json': {
        routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Register these routes
        parent: null,
        hasSpecificRoute: true
    },
    // 'todo_items.json': {
    //     routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Register these routes for nested
    //     parent: 'todos',
    //     parentKey: 'todoId',
    //     hasSpecificRoute: true
    // }
};*/

// export const registerDynamicRoutes = (fastify: FastifyInstance) => {
//     const dataDir = path.join(__dirname, '../data');
//     const files = fs.readdirSync(dataDir);
//
//     files.forEach((file) => {
//         const routeName = path.basename(file, '.json');
//         const routePath = `/${routeName}`;
//         const dataFilePath = path.join(dataDir, file);
//
//         // @ts-ignore
//         const config: RouteConfig = routeConfig[file] || { routes: ['GET'], hasSpecificRoute: true, parent: null, parentKey: '' };
//
//         if (!isRouteRegistered(fastify, routePath)) {
//             registerRoutes(fastify, config.routes, routePath, dataFilePath, config);
//         }
//
//         if (config.parent) {
//             const nestedRoutePath = `/${config.parent}/:${config.parentKey}/${routeName}`;
//             if (!isRouteRegistered(fastify, nestedRoutePath)) {
//                 registerNestedRoutes(fastify, config, routeName, dataFilePath);
//             }
//         }
//     });
// };


export const registerDynamicRoutes = (fastify: FastifyInstance) => {
    const dataDir = path.join(__dirname, config.dataDir); // Use the configured data directory
    const files = fs.readdirSync(dataDir);

    files.forEach((file) => {
        const routeName = path.basename(file, '.json');
        const routePath = `/${routeName}`;
        const dataFilePath = path.join(dataDir, file);

        // Get configuration from the external file
        const routeConfig: RouteConfig = config.routeConfig[file] || { routes: ['GET'], hasSpecificRoute: true, parent: null, parentKey: '' };

        if (!isRouteRegistered(fastify, routePath)) {
            registerRoutes(fastify, routeConfig.routes, routePath, dataFilePath, routeConfig);
        }

        if (routeConfig.parent) {
            const nestedRoutePath = `/${routeConfig.parent}/:${routeConfig.parentKey}/${routeName}`;
            if (!isRouteRegistered(fastify, nestedRoutePath)) {
                registerNestedRoutes(fastify, routeConfig, routeName, dataFilePath);
            }
        }
    });
};

const isRouteRegistered = (fastify: FastifyInstance, routePath: string): boolean => {
    const routesList = fastify.printRoutes({ commonPrefix: false });
    return routesList.includes(routePath);
};

const registerRoutes = (fastify: FastifyInstance, routes: string[], routePath: string, dataFilePath: string, config?: RouteConfig) => {
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

                if (config?.hasSpecificRoute) {
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

interface RouteConfig {
    routes: string[];
    parent: string | null;
    parentKey: string;
    hasSpecificRoute: boolean;
}

const registerNestedRoutes = (
    fastify: FastifyInstance,
    config: RouteConfig,
    routeName: string,
    dataFilePath: string
) => {
    const parentRouteName = config.parent;
    const parentKey = config.parentKey;
    const nestedRoutePath = `/${parentRouteName}/:${parentKey}/${routeName}`;

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
