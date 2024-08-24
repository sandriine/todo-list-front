import { FastifyInstance } from 'fastify';
import { routeWithBody } from '../utils/routeUtils';

export const registerPostRoutes = (fastify: FastifyInstance) => {
    fastify.post('/todos', routeWithBody('./data/todos.json', (data, body) => {
        const newTodo = { id: data.length + 1, ...body };
        data.push(newTodo);  // Append the new item to the list
        return null;  // Return null or undefined to indicate no response body
    }, { statusCode: 201 }));
    // Add more POST routes as needed
};
