const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'todos.json');

// Helper function to read the JSON file
function readTodosFromFile() {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
}

// Helper function to write to the JSON file
function writeTodosToFile(todos) {
    fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
}

function getAllTodos() {
    return readTodosFromFile();
}

function getTodoById(id) {
    const todos = readTodosFromFile();
    return todos.find(t => t.id === id);
}

function addTodo(title) {
    const todos = readTodosFromFile();
    const newTodo = {
        id: todos.length + 1,
        title,
        completed: false
    };
    todos.push(newTodo);
    writeTodosToFile(todos);
    return newTodo;
}

function updateTodoById(id, { title, completed }) {
    const todos = readTodosFromFile();
    const todo = todos.find(t => t.id === id);
    if (!todo) {
        return null;
    }
    todo.title = title !== undefined ? title : todo.title;
    todo.completed = completed !== undefined ? completed : todo.completed;
    writeTodosToFile(todos);
    return todo;
}

function deleteTodoById(id) {
    let todos = readTodosFromFile();
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) {
        return null;
    }
    const deletedTodo = todos.splice(index, 1);
    writeTodosToFile(todos);
    return deletedTodo[0];
}

module.exports = {
    getAllTodos,
    getTodoById,
    addTodo,
    updateTodoById,
    deleteTodoById
};
