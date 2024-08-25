
# API Directory

## Overview
This directory contains the API controllers responsible for handling HTTP requests. Each controller corresponds to a specific HTTP method (GET, POST, PUT, PATCH, DELETE) and is used to define the logic for those requests.

## File Structure
- **get.controller.ts**: Handles GET requests.
- **post.controller.ts**: Handles POST requests.
- **put.controller.ts**: Handles PUT requests.
- **patch.controller.ts**: Handles PATCH requests.
- **delete.controller.ts**: Handles DELETE requests.

## Creating a New Controller
To add a new HTTP method for a specific endpoint, create a new file in this directory following the naming convention: `method.controller.ts`.

Example:
```typescript
import { FastifyInstance } from 'fastify';

export const registerGetRoutes = (fastify: FastifyInstance) => {
    fastify.get('/example', async (request, reply) => {
        // Your logic here
        reply.send({ message: 'GET request received' });
    });
};
```
