import {MockServerConfig} from "./types/interfaces";
    
const config: MockServerConfig = {
    dataDir: '../data', // Directory where JSON files are stored
    routeConfig: {

        'todos.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parents: [],
            customParentKeys: {},
            hasSpecificRoute: true
        },
        'items.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parents: ['todos'],
            customParentKeys: {},
            hasSpecificRoute: true
        },
        'subtasks.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parents: ['todos', 'items'],
            customParentKeys: {},
            hasSpecificRoute: true
        },
        'categories.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parents: ['products'],
            customParentKeys: { 'products': 'productId' },
            hasSpecificRoute: true
        },
        'products.json': {
            routes: ['GET'],
            parents: [],
            customParentKeys: {},
            hasSpecificRoute: false
        }
    }
};

export default config;