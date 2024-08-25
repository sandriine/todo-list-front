module.exports = {
    dataDir: '../data', // Directory where JSON files are stored
    routeConfig: {
        'todos.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specify the routes to create
            parent: null, // No parent route (not nested)
            parentKey: '', // No parent key required
            hasSpecificRoute: true // Include specific routes like /:id
        },
        'todo_items.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specify the routes to create
            parent: 'todos', // This is a nested route under 'todos'
            parentKey: 'todoId', // The key used in the nested route
            hasSpecificRoute: true // Include specific routes like /:id
        },
        // Add more JSON files and their configurations as needed
    }
};