import 'fastify';
import '@fastify/jwt';

import { UserRequestInterface } from '@/common/interfaces/user-request.interface';

declare module 'fastify' {
    interface FastifyRequest {
        user?: UserRequestInterface;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: UserRequestInterface;
    }
}
