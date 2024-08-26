import {MockServerConfig} from "./types/interfaces";
    
const config: MockServerConfig = {
    dataDir: '../data', // Directory where JSON files are stored
    routeConfig: {
        
        'products.json': {
            routes: ['GET'],
            parents: null,
            customParentKeys: null,
            hasSpecificRoute: false
        },
        'todo_items.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parents: ['todos'],
            customParentKeys: null,
            hasSpecificRoute: true
        },
        'todos.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parents: null,
            customParentKeys: null,
            hasSpecificRoute: true
        }
    }
};

export default config;