import { FastifyReply, FastifyRequest } from 'fastify';

import { UserRequestInterface } from '../interfaces/user-request.interface';
import { CustomerError } from '../errors/customer.error';

export async function jwtGuard(request: FastifyRequest, reply: FastifyReply) {
    try {
        const decoded = await request.jwtVerify<UserRequestInterface>();
        request.user = decoded;
    } catch (err) {
        reply.status(403).send(new CustomerError('Unauthenticated', 403));
    }
}
