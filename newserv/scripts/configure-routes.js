// const fs = require('fs');
// const path = require('path');
// const config = require('./mockserver.config');
//
// const dataDir = path.join(__dirname, './data');
// const files = fs.readdirSync(dataDir);
//
// files.forEach((file) => {
//     if (!config.routeConfig[file]) {
//         console.log(`\x1b[33m[INFO]\x1b[0m Found new file: ${file}`);
//
//         config.routeConfig[file] = {
//             routes: ['GET'], // available HTTP methods : GET, POST, PUT, PATCH, DELETE
//             parent: null,
//             parentKey: '',
//             hasSpecificRoute: false,
//         };
//
//         const configString = `module.exports = {
//     dataDir: '${config.dataDir}', // Directory where JSON files are stored
//     routeConfig: ${JSON.stringify(config.routeConfig, null, 4)
//             .replace(/"([^"]+\.json)":/g, "'$1':") // Wrap only the JSON file names in single quotes
//             .replace(/"(\w+)":/g, '$1:')           // Remove quotes from object keys
//             .replace(/\[\s+"([^"]+)",\s+"([^"]+)",\s+"([^"]+)",\s+"([^"]+)",\s+"([^"]+)"\s+]/g, "['$1', '$2', '$3', '$4', '$5']") // Keep array items on the same line with single quotes for HTTP methods
//             .replace(/parent:\s+"([^"]*)"/g, (match, p1) => p1 ? `parent: '${p1}'` : 'parent: null') // Replace parent value double quotes with single quotes or null
//             .replace(/parentKey:\s+"([^"]*)"/g, (match, p1) => p1 ? `parentKey: '${p1}'` : 'parentKey: null')}
// };`;
//
//         fs.writeFileSync('./mockserver.config.js', configString, 'utf-8');
//         console.log(`\x1b[32m[INFO]\x1b[0m Added default route configuration for ${file}`);
//     }
// });
//
// console.log('\x1b[32m[INFO]\x1b[0m Configuration complete!');

const fs = require('fs');
const path = require('path');
const config = require('../config/mockserver.config');

const dataDir = path.join(__dirname, config.dataDir);
const files = fs.readdirSync(dataDir);

files.forEach((file) => {
    if (!config.routeConfig[file]) {
        console.log(`\x1b[33m[INFO]\x1b[0m Found new file: ${file}`);

        // Default configuration: only GET method without specific routes
        config.routeConfig[file] = {
            routes: ['GET'],
            parent: null,
            parentKey: null,
            hasSpecificRoute: false,
        };

        const configString = `module.exports = {
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
};`;

        fs.writeFileSync('./mockserver.config.js', configString, 'utf-8');
        console.log(`\x1b[32m[INFO]\x1b[0m Added default GET route configuration for ${file}`);
    }
});

console.log('\x1b[32m[INFO]\x1b[0m Configuration complete!');
