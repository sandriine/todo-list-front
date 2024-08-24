import { FastifyInstance } from 'fastify';
import { getRoute } from '../utils/routeUtils';

export const registerGetRoutes = (fastify: FastifyInstance) => {
    fastify.get('/todos', getRoute('./data/todos.json'));
    fastify.get('/todos/:id', getRoute('./data/todos.json'));
};
