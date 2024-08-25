import { FastifyInstance } from 'fastify';
import { routeWithBody } from '../utils/routeUtils';
import { NotFoundError } from '../utils/errors';

export const registerPatchRoutes = (fastify: FastifyInstance) => {
    // fastify.patch('/todos/:id', routeWithBody('./data/todos.json', (data, body, params) => {
    //     const todoId = String(params.id);  // Convert the ID from params to a string
    //     const todoIndex = data.findIndex((todo: any) => String(todo.id) === todoId);
    //
    //     if (todoIndex === -1) {
    //         throw new NotFoundError('Todo not found');
    //     }
    //
    //     // Merge the existing todo with the new data (partial update)
    //     data[todoIndex] = { ...data[todoIndex], ...body };
    //     return null;  // No content to return
    // }, { statusCode: 204 }));
};
