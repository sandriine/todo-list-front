
# Mock Server

## Overview
This mock server is designed to provide a flexible and extensible environment for testing and developing front-end applications. It allows for dynamic route generation based on JSON files, enabling you to simulate a wide range of API behaviors.

## Key Features
- **Dynamic Route Generation**: Automatically generates routes based on JSON files.
- **Customizable Configuration**: Easily customize the behavior of routes via configuration files.
- **Error Simulation**: Simulate different HTTP errors to test front-end error handling.

## Getting Started

### Prerequisites
- Node.js (v12 or higher)
- npm

### Installation
```bash
git clone <repository-url>
cd mockserver
npm install
```

### Running the Server
```bash
npx ts-node index.ts
```

### Project Structure
```
mockserver/
├── api/                # API controllers for handling HTTP requests
├── config/             # Configuration files and types
├── data/               # JSON files used as mock data
├── routes/             # Dynamic route registration logic
├── plugins/            # Custom Fastify plugins
│   └── configureRoutesPlugin.ts  # Plugin for configuring routes dynamically
├── utils/              # Utility functions and error handling
├── index.ts            # Main entry point for the server
└── tsconfig.json       # TypeScript configuration
```

### Usage
- **Adding New Routes**: Simply add a new JSON file to the `data/` directory. A `GET` route will be automatically created.
- **Customizing Routes**: Modify the `mockserver.config.ts` file in the `config/` directory to add more HTTP methods or customize behavior.

## Configuration Explanation

The `mockserver.config.ts` file is crucial for controlling how the mock server behaves. It allows you to specify how routes are generated based on the JSON files in the `data/` directory.

### Explanation of `mockserver.config.ts` Properties

#### 1. `routes`
**Purpose**: Specifies which HTTP methods should be available for a particular JSON file. 

- **Example**: 
  ```typescript
  'todos.json': {
      routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Enable all methods
      parent: null,
      parentKey: null,
      hasSpecificRoute: true
  }
  ```

#### 2. `parent`
**Purpose**: Defines a parent resource for nested routes. 

- **Example**: 
  ```typescript
  'todo_items.json': {
      routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      parent: 'todos', // Indicates that this resource is nested under the 'todos' resource
      parentKey: 'todoId',
      hasSpecificRoute: true
  }
  ```

#### 3. `parentKey`
**Purpose**: Specifies the key in the child resource that links it to the parent resource.

- **Example**: 
  ```typescript
  'todo_items.json': {
      routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      parent: 'todos',
      parentKey: 'todoId', // Indicates the key used to link items to their parent todo
      hasSpecificRoute: true
  }
  ```

#### 4. `hasSpecificRoute`
**Purpose**: Controls whether routes like `/:id` are created, allowing access to specific items within a resource.

- **Example**: 
  ```typescript
  'todos.json': {
      routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      parent: null,
      parentKey: null,
      hasSpecificRoute: true // Enables /todos/:id
  }
  ```

### Full Example
Here’s how these properties can be combined to define the behavior of your mock server:

```typescript
export default {
    dataDir: '../data',
    routeConfig: {
        'todos.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parent: null,
            parentKey: null,
            hasSpecificRoute: true // Enables /todos/:id
        },
        'todo_items.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parent: 'todos',
            parentKey: 'todoId',
            hasSpecificRoute: true // Enables /todos/:todoId/items/:id
        }
    }
};
```

By understanding these configuration properties, you can tailor the mock server to simulate a wide variety of API interactions.

## Contributing
We welcome contributions! Please see the `CONTRIBUTING.md` file for more details.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
