import {MockServerConfig} from "./types/interfaces";

const config: MockServerConfig = {
    dataDir: '../data', // Directory where JSON files are stored
    routeConfig: {

        'items.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parents: ['todos'],
            customParentKeys: {'todos':'todo_list_id'},
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