import {MockServerConfig} from "./types/interfaces";

const config: MockServerConfig = {
    dataDir: '../data', // Directory where JSON files are stored
    routeConfig: {
        
        'categories.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parents: ["products"],
            customParentKeys: {"products":"productId"},
            hasSpecificRoute: true
        },
        'items.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parents: ["todos"],
            customParentKeys: {},
            hasSpecificRoute: true
        },
        'nothing.json': {
            routes: ['GET'],
            parents: [],
            customParentKeys: {},
            hasSpecificRoute: false
        },
        'products.json': {
            routes: ['GET'],
            parents: [],
            customParentKeys: {},
            hasSpecificRoute: false
        },
        'subtasks.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parents: ["todos","items"],
            customParentKeys: {},
            hasSpecificRoute: true
        },
        'todos.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parents: [],
            customParentKeys: {},
            hasSpecificRoute: true
        }
    }
};

export default config;