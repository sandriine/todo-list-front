import {MockServerConfig} from "./types/interfaces";

const config: MockServerConfig = {
    dataDir: '../data', // Directory where JSON files are stored
    routeConfig: {

        'items.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parents: ['todos'],
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