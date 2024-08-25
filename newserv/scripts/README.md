
# Scripts Directory

## Overview
This directory contains utility scripts that assist with the setup and configuration of the mock server.

## `configure-routes.ts`
This script scans the `data/` directory for new JSON files and updates the `mockserver.config.ts` file with the appropriate route configurations.

### Usage
This script is automatically run when you start the server via `index.ts`. If you need to manually run the script, use the following command:
```bash
npx ts-node ./scripts/configure-routes.ts
```

## Adding New Scripts
You can add new utility scripts to this directory as needed.
