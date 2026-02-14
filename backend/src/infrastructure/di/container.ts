import fp from 'fastify-plugin';
import { container } from 'tsyringe';

import { registerDependencies } from './register';

export default fp(async (fastify) => {
    registerDependencies();
    fastify.decorate('di', container);
});
