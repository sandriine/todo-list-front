
# Plugins Directory

## Overview
This directory contains custom Fastify plugins that are used to enhance the functionality of the mock server. Each plugin is designed to encapsulate specific logic or behavior, making it reusable and easy to manage.

## Files

### `configureRoutesPlugin.ts`
- **Purpose**: This plugin dynamically configures the routes for the mock server based on the JSON files present in the `data/` directory. It automatically registers the appropriate HTTP methods (e.g., GET, POST) for each JSON file and handles nested routes and specific item routes.

- **How It Works**:
    - Scans the `data/` directory for JSON files.
    - Skips non-JSON files.
    - If a JSON file is new, it adds default route configurations to the `mockserver.config.ts` file.
    - Logs the configuration process for easy debugging.

- **Integration**:
    - The plugin is registered in the main server file (`index.ts`), ensuring that the route configuration is executed as part of the Fastify server initialization process.

## Adding New Plugins
To add a new plugin, simply create a new TypeScript file in this directory and export it using Fastify's `fastify-plugin` utility. This will allow the plugin to be easily integrated into the server setup.

### Example:
```typescript
import fp from 'fastify-plugin';

const myCustomPlugin = async (fastify, options) => {
    // Plugin logic goes here
};

export default fp(myCustomPlugin);
```

Once the plugin is created, register it in the `index.ts` file:
```typescript
fastify.register(myCustomPlugin);
```

This modular approach keeps the codebase organized and allows for the easy addition of new functionality.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
