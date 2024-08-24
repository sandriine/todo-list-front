import { FastifyInstance } from 'fastify';
import { deleteRoute } from '../utils/routeUtils';

export const registerDeleteRoutes = (fastify: FastifyInstance) => {
    fastify.delete('/todos/:id', deleteRoute('./data/todos.json', 'id'));
    // Add more DELETE routes as needed
};