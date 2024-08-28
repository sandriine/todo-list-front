import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export const createServer = () => {
    const fastify = Fastify({ logger: true });

    fastify.register(fastifySwagger, {
        openapi: {
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
            docExpansion: 'full',
            deepLinking: false
        }
    });

    // Add any Fastify plugins or custom settings here, like CORS or static file serving
    fastify.register(cors, {
        origin: '*',
    })

    return fastify;
};
