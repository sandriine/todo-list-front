import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";

export const createServer = () => {
    const fastify = Fastify({ logger: true });

    // Add any Fastify plugins or custom settings here, like CORS or static file serving
    fastify.register(cors, {
        origin: '*',
    });

    fastify.register(fastifySwagger, {
        openapi: {
            openapi: '3.1.0',
            info: {
                title: 'Mock Server API',
                description: 'API documentation for dynamically generated routes',
                version: '1.0.0'
            }
        }
    });

    fastify.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        }
    });

    return fastify;
};
