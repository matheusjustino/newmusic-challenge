import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';

import { logger } from '../logger';
import { UserRequestInterface } from '../interfaces/user-request.interface';

@injectable()
export class JwtHelper {
    public generateToken(payload: UserRequestInterface): string {
        logger.info(`Generating JWT token...`);

        const tokenPayload = {
            id: payload.id,
            email: payload.email,
        };

        return jwt.sign(tokenPayload, process.env.JWT_SECRET as string, {
            expiresIn: '12h',
        });
    }
}
