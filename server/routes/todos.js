const {
    getAllTodos,
    getTodoById,
    addTodo,
    updateTodoById,
    deleteTodoById
} = require('../data/todos');

function todosRoutes(fastify, options, done) {

    // GET /todos - Fetch all todos
    fastify.get('/todos', function (request, reply) {
        reply.send(getAllTodos());
    });

    // POST /todos - Create a new todo
    fastify.post('/todos', function (request, reply) {
        const { title } = request.body;
        if (!title) {
            reply.code(400).send({ error: 'Title is required' });
            return;
        }
        const newTodo = addTodo(title);
        reply.code(201).send(newTodo);
    });

    // PUT /todos/:id - Update an existing todo
    fastify.put('/todos/:id', function (request, reply) {
        const { title, completed } = request.body;
        const id = parseInt(request.params.id, 10);
        if (!title && completed === undefined) {
            reply.code(400).send({ error: 'At least one field (title or completed) is required' });
            return;
        }
        const updatedTodo = updateTodoById(id, { title, completed });
        if (!updatedTodo) {
            reply.code(404).send({ error: 'Todo not found' });
            return;
        }
        reply.send(updatedTodo);
    });

    // DELETE /todos/:id - Delete a todo
    fastify.delete('/todos/:id', function (request, reply) {
        const id = parseInt(request.params.id, 10);
        const deletedTodo = deleteTodoById(id);
        if (!deletedTodo) {
            reply.code(404).send({ error: 'Todo not found' });
            return;
        }
        reply.code(204).send();
    });

    done();
}

module.exports = todosRoutes;
