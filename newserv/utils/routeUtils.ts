import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import path from 'path';

// Utility to add delay as a Promise
export const delay = (time = 500) => new Promise((resolve) => setTimeout(resolve, time));

export const getRoute = (dataFilePath: string) => async (request: FastifyRequest, reply: FastifyReply) => {
    await delay();

    // Extract data from the JSON file
    const data = JSON.parse(fs.readFileSync(path.resolve(dataFilePath), 'utf8'));

    // Check for error simulation fragments in the URL
    // @ts-ignore
    const handling = request.query.errorTypes as string;
    if (handling) {
        switch (handling.toLowerCase()) {
            case 'notfound':
                reply.status(404).send({ error: 'Not Found' });
                return;
            case 'servererror':
                reply.status(500).send({ error: 'Internal Server Error' });
                return;
            case 'unauthorized':
                reply.status(401).send({ error: 'Unauthorized' });
                return;
            case 'forbidden':
                reply.status(403).send({ error: 'Forbidden' });
                return;
            default:
                reply.status(400).send({ error: 'Bad Request' });
                return;
            // Add more cases as needed
        }
    }

    // Type params explicitly
    const params: Record<string, string> = request.params as Record<string, string>;

    if (Object.keys(params).length > 0) {
        const filteredData = data.filter((item: any) =>
            Object.keys(params).every((key) => String(item[key]) === String(params[key]))
        );

        if (filteredData.length === 0) {
            reply.status(404).send({ error: 'Item not found' });
        } else {
            reply.status(200).send(filteredData.length === 1 ? filteredData[0] : filteredData);
        }
    } else {
        // Return all data if no specific filtering is needed
        reply.status(200).send(data);
    }
};
// Generic route handler for POST, PUT, and PATCH requests
export const routeWithBody = (
    dataFilePath: string,
    method: (data: any[], body: any, params?: any) => any,
    options?: { statusCode: number }
) => async (request: FastifyRequest, reply: FastifyReply) => {
    const data = JSON.parse(fs.readFileSync(path.resolve(dataFilePath), 'utf8'));
    method(data, request.body, request.params);  // Execute the side effect with params (for PUT)
    fs.writeFileSync(path.resolve(dataFilePath), JSON.stringify(data, null, 2));
    reply.status(options?.statusCode || 200).send();  // Send response with appropriate status code
};

// Generic DELETE route handler
/*export const deleteRoute = (dataFilePath: string, idKey: string) => async (request: FastifyRequest, reply: FastifyReply) => {
    const data = JSON.parse(fs.readFileSync(path.resolve(dataFilePath), 'utf8'));
    // @ts-ignore
    const updatedData = data.filter((item: any) => item[idKey] !== request.params.id);
    fs.writeFileSync(path.resolve(dataFilePath), JSON.stringify(updatedData, null, 2));
    reply.status(204).send();  // Send a 204 No Content status with no response body
};*/

/*export const deleteRoute = (dataFilePath: string, idKey: string) => async (request: FastifyRequest, reply: FastifyReply) => {
    const data = JSON.parse(fs.readFileSync(path.resolve(dataFilePath), 'utf8'));
    console.log('Data before deletion:', data);

    // @ts-ignore
    const idToDelete = parseInt(request.params.id, 10);
    console.log('ID to delete:', idToDelete);

    const updatedData = data.filter((item: any) => item[idKey] !== idToDelete);
    console.log('Data after deletion:', updatedData);

    // Write the updated data back to the file
    fs.writeFileSync(path.resolve(dataFilePath), JSON.stringify(updatedData, null, 2));

    // Respond with 204 No Content
    reply.status(204).send();
};*/

// export const deleteRoute = (dataFilePath: string, idKey: string) => async (request: FastifyRequest, reply: FastifyReply) => {
//     const data = JSON.parse(fs.readFileSync(path.resolve(dataFilePath), 'utf8'));
//
//     // @ts-ignore
//     const idToDelete = request.params.id; // Keep the ID as a string
//     const updatedData = data.filter((item: any) => item[idKey] !== idToDelete);
//
//     // Write the updated data back to the file
//     fs.writeFileSync(path.resolve(dataFilePath), JSON.stringify(updatedData, null, 2));
//
//     // Respond with 204 No Content
//     reply.status(204).send();
// };


// Generic DELETE route handler that handles both numeric and string IDs
export const deleteRoute = (dataFilePath: string, idKey: string) => async (request: FastifyRequest, reply: FastifyReply) => {
    const data = JSON.parse(fs.readFileSync(path.resolve(dataFilePath), 'utf8'));

    // @ts-ignore
    const idToDelete = request.params.id; // Keep the ID as a string from the request
    const updatedData = data.filter((item: any) => String(item[idKey]) !== idToDelete);

    // Write the updated data back to the file
    fs.writeFileSync(path.resolve(dataFilePath), JSON.stringify(updatedData, null, 2));

    // Respond with 204 No Content
    reply.status(204).send();
};
