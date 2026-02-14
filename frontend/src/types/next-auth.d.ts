import 'next-auth';
import 'next-auth/jwt';
import NextAuth, { DefaultSession } from 'next-auth';

// INTERFACES
import { IUserRequest } from '@/interfaces/user-request.interface';

declare module 'next-auth' {
    interface User {
        id: string;
        email: string;
        token: string;
    }

    interface Session {
        user?: IUserRequest & DefaultSession['user'];
        error?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        accessTokenExpires?: number;
    }
}
