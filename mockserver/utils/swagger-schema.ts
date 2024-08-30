// @ts-ignore
import {JSONObject, JSONValue} from "@fastify/swagger";

export const generateSwaggerSchema = (
    method: string,
    routePath: string,
    fileName: string,
    hasSpecificRoute: boolean
): { general: JSONObject, specific?: JSONObject } => {
    const generalSchema: JSONObject = {
        description: `Handles ${method.toUpperCase()} requests for ${routePath}`,
        tags: [fileName],
        response: {
            200: {
                description: 'Successful response',
                type: method === 'GET' ? 'array' : 'object',
                ...(method === 'GET' && { items: { type: 'object', additionalProperties: true } }),
                ...(method !== 'GET' && {
                    properties: {
                        id: { type: 'string', description: 'ID of the resource' }
                    }
                })
            },
            404: {
                description: 'Resource not found',
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            }
        }
    };

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
        generalSchema.body = {
            type: 'object',
            description: 'The data for the resource',
            additionalProperties: true,
        };
    }

    if (!hasSpecificRoute || method === 'POST') {
        return { general: generalSchema };
    }

    const specificSchema: JSONObject = {
        ...generalSchema,
        description: `Handles specific GET requests for ${routePath}/:id`,
        tags: [fileName],
        params: {
            type: 'object',
            properties: {
                id: { type: 'string', description: 'ID of the resource' }
            },
            required: ['id'] as unknown as JSONValue[] // Cast to JSONValue[] to avoid readonly array type issue
        } as unknown as JSONObject, // Cast the entire object as JSONObject
        response: {
            200: {
                description: 'Successful response',
                type: 'object',
                additionalProperties: true,
            },
            404: {
                description: 'Resource not found',
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            }
        }
    };

    return { general: generalSchema, specific: specificSchema };
};


