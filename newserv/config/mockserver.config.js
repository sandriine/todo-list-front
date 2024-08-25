module.exports = {
    dataDir: '../data', // Directory where JSON files are stored
    routeConfig: {

       'todos.json': {
           routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
           parent: null,
           parentKey: null,
           hasSpecificRoute: true
       },
       'todo_items.json': {
           routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
           parent: 'todos',
           parentKey: 'todoId',
           hasSpecificRoute: true
       },
       'products.json': {
           routes: ['GET'],
           parent: null,
           parentKey: null,
           hasSpecificRoute: false
       }
    }
};