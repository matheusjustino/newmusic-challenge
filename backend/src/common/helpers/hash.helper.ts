import { genSalt, hash, compare } from 'bcryptjs';
import { injectable } from 'tsyringe';

import { logger } from '../logger';

@injectable()
export class HashHelper {
    public async hash(data: string, salt = 12): Promise<string> {
        logger.info('Hashing data...');

        const generatedSalt = await genSalt(salt);
        return hash(data, generatedSalt);
    }

    public async compare(password: string, hash: string): Promise<boolean> {
        logger.info('Comparing hash and data...');
        return compare(password, hash);
    }
}
