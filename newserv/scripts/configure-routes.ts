import fs from 'fs';
import path from 'path';
import config from '../config/mockserver.config';

const dataDir = path.join(__dirname, config.dataDir);
const files = fs.readdirSync(dataDir);

files.forEach((file) => {
    // Skip non-JSON files, such as README_old.md
    if (path.extname(file) !== '.json') {
        console.log(`[INFO] Skipping non-JSON file: ${file}`);
        return;
    }

    if (!config.routeConfig[file]) {
        console.log(`\x1b[33m[INFO]\x1b[0m Found new file: ${file}`);

        // Default configuration: only GET method without specific routes
        config.routeConfig[file] = {
            routes: ['GET'],
            parent: null,
            parentKey: null,
            hasSpecificRoute: false,
        };

        const configString = `import {MockServerConfig} from "./types/interfaces";
    
const config: MockServerConfig = {
    dataDir: '${config.dataDir}', // Directory where JSON files are stored
    routeConfig: {
        ${Object.entries(config.routeConfig).map(([key, value]) => `
        '${key}': {
            routes: [${value.routes.map(route => `'${route}'`).join(', ')}],
            parent: ${value.parent ? `'${value.parent}'` : 'null'},
            parentKey: ${value.parentKey ? `'${value.parentKey}'` : 'null'},
            hasSpecificRoute: ${value.hasSpecificRoute}
        }`).join(',')}
    }
};

export default config;`;


        fs.writeFileSync(path.join(__dirname, '../config/mockserver.config.ts'), configString, 'utf-8');
        console.log(`\x1b[32m[INFO]\x1b[0m Added default GET route configuration for ${file}`);
    }
});

console.log('\x1b[32m[INFO]\x1b[0m Configuration complete!');
