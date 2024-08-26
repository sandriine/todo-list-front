import {MockServerConfig} from "./types/interfaces";
    
const config: MockServerConfig = {
    dataDir: '../data', // Directory where JSON files are stored
    routeConfig: {
        
        'products.json': {
            routes: ['GET'],
            parent: null,
            parentKey: null,
            hasSpecificRoute: false
        },
        'todo_items.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parent: 'todos',
            parentKey: 'todoId',
            hasSpecificRoute: true
        },
        'todos.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parent: null,
            parentKey: null,
            hasSpecificRoute: true
        }
    }
};

export default config;