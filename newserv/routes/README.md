
# Routes Directory

## Overview
This directory contains the logic for dynamically registering routes based on the JSON files in the `data/` directory and the configuration in `mockserver.config.ts`.

## Dynamic Route Registration
The `dynamicRoutes.ts` file is responsible for scanning the `data/` directory and registering routes based on the configuration.

Example:
```typescript
export const registerDynamicRoutes = (fastify: FastifyInstance, config: MockServerConfig) => {
    // Logic for dynamic route registration
};
```

## Modifying Route Behavior
If you need to modify how routes are registered or add custom logic, edit the `dynamicRoutes.ts` file.
