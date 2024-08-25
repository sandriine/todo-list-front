import Fastify from 'fastify';

export const createServer = () => {
    const fastify = Fastify({ logger: true });

    // Add any Fastify plugins or custom settings here, like CORS or static file serving

    return fastify;
};
