
# Config Directory

## Overview
This directory contains configuration files and type definitions that control the behavior of the mock server.

## Files
- **fastify.config.ts**: Configuration for the Fastify server instance.
- **mockserver.config.ts**: Main configuration file that controls route behavior.
- **types/interfaces.ts**: Centralized type definitions for the project.

## Customizing Routes
Modify the `mockserver.config.ts` file to customize the behavior of the routes.

Example:
```typescript
const config: MockServerConfig = {
    dataDir: '../data',
    routeConfig: {
        'todos.json': {
            routes: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            parent: null,
            parentKey: null,
            hasSpecificRoute: true,
        },
        // Other configurations...
    },
};
```
This file allows you to define which HTTP methods are available for each JSON file and how they should behave.

## Adding New Types
Add new type definitions in `interfaces.ts` if you need to extend the functionality or define new structures.
