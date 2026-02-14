import { NextAuthOptions, getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';

// INTERFACES
import { UserRequestInterface } from '../interfaces/user-request.interface';

// SERVICES
import { doLogin } from '../services/auth.service';

const tokenMaxAge = 60 * 60 * 12;

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: tokenMaxAge,
    },
    jwt: {
        maxAge: tokenMaxAge,
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                email: {
                    label: 'email',
                    type: 'email',
                    placeholder: 'your@email.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials, req) => {
                if (!credentials) {
                    throw new Error('Invalid data');
                }
                try {
                    const response = await doLogin(credentials);
                    if (!response) {
                        throw new Error('Invalid credentials');
                    }

                    const cookieStore = await cookies();
                    cookieStore.set('auth-token', response.token);

                    return Promise.resolve(response);
                } catch (error: any) {
                    console.error({ nextauth: error?.response ?? error });

                    if (
                        error.code === 'ECONNREFUSED' ||
                        error.message.includes('Network Error') ||
                        error.message.includes('connect ECONNREFUSED')
                    ) {
                        throw new Error('Unable to connect to the server');
                    }

                    const errorMsg =
                        (Array.isArray(error.response?.data?.error)
                            ? error.response.data.error.join('')
                            : error.response?.data.error) ||
                        error.response?.data?.message ||
                        error.message ||
                        error;

                    throw new Error(errorMsg);
                }
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                const decodedToken = jwtDecode(user.token);
                token.user = user;
                token.accessTokenExpires = Number(decodedToken.exp);
            }

            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user = token.user as UserRequestInterface;
            }

            return session;
        },
    },
};

export const getAuthSession = async () => await getServerSession(authOptions);
