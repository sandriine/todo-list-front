import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import path from 'path';

export const delay = (time = 500) => new Promise((resolve) => setTimeout(resolve, time));

export const getRoute = (dataFilePath: string) => async (request: FastifyRequest, reply: FastifyReply) => {
    await delay();

    const data = readDataFromFile(dataFilePath);

    if (simulateError(request, reply)) return;

    const params = request.params as Record<string, string>;

    if (Object.keys(params).length > 0) {
        const filteredData = filterDataByParams(data, params);
        if (filteredData.length === 0) {
            reply.status(404).send({ error: 'Item not found' });
        } else {
            reply.status(200).send(filteredData.length === 1 ? filteredData[0] : filteredData);
        }
    } else {
        reply.status(200).send(data);
    }
};

export const routeWithBody = (
    dataFilePath: string,
    method: (data: any[], body: any, params?: any) => any,
    options?: { statusCode: number }
) => async (request: FastifyRequest, reply: FastifyReply) => {
    const data = readDataFromFile(dataFilePath);
    method(data, request.body, request.params);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    reply.status(options?.statusCode || 200).send();
};

export const deleteRoute = (dataFilePath: string, idKey: string) => async (request: FastifyRequest, reply: FastifyReply) => {
    const data = readDataFromFile(dataFilePath);
    // @ts-ignore
    const idToDelete = String(request.params.id);
    const updatedData = data.filter((item: any) => String(item[idKey]) !== idToDelete);

    fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2));
    reply.status(204).send();
};

const simulateError = (request: FastifyRequest, reply: FastifyReply): boolean => {
    const errorType = (request.query as any).errorType;
    if (errorType) {
        switch (errorType.toLowerCase()) {
            case 'notfound':
                reply.status(404).send({ error: 'Not Found' });
                return true;
            case 'servererror':
                reply.status(500).send({ error: 'Internal Server Error' });
                return true;
            case 'unauthorized':
                reply.status(401).send({ error: 'Unauthorized' });
                return true;
            case 'forbidden':
                reply.status(403).send({ error: 'Forbidden' });
                return true;
            default:
                reply.status(400).send({ error: 'Bad Request' });
                return true;
        }
    }
    return false;
};

const readDataFromFile = (filePath: string) => {
    return JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'));
};

const filterDataByParams = (data: any[], params: Record<string, string>) => {
    return data.filter((item: any) =>
        Object.keys(params).every((key) => String(item[key]) === String(params[key]))
    );
};
