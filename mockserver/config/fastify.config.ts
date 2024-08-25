import Fastify from 'fastify';
import cors from '@fastify/cors';

export const createServer = () => {
    const fastify = Fastify({ logger: true });

    // Add any Fastify plugins or custom settings here, like CORS or static file serving
    fastify.register(cors, {
        origin: '*',
    })

    return fastify;
};
