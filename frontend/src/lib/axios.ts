import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const isServer = typeof window === 'undefined';

const cookiesInterceptor = async (req: any) => {
    if (isServer) {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        req.headers.Authorization = `Bearer ${cookieStore.get('auth-token')?.value}`;
    }
    return req;
};

const clientBaseURL = !isServer
    ? process.env.NEXT_PUBLIC_API_URL || `${window.location.origin}/api`
    : undefined;

const api = axios.create({
    // On the server (Next.js SSR/Route Handlers), prefer INTERNAL_API_URL (e.g., http://backend:8080/api).
    // On the client (browser), use NEXT_PUBLIC_API_URL (e.g., http://localhost:8080/api). Fallback to current origin.
    baseURL: isServer
        ? process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL
        : clientBaseURL,
});

api.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session?.user) {
        config.headers.Authorization = `Bearer ${session?.user.token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.error('Authentication error:', error.response?.data);
            if (!isServer) {
                await signOut({ redirect: true, callbackUrl: '/sign-in' });
                window.location.href = '/sign-in';
            }
        }
        return Promise.reject(error);
    },
);

api.interceptors.request.use(cookiesInterceptor);

export { api };
