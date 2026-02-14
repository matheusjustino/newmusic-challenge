import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isPublicRoute =
        pathname === '/' ||
        pathname.startsWith('/sign-in') ||
        pathname.startsWith('/sign-up');

    if (pathname.startsWith('/_next') || pathname.includes('.')) {
        return NextResponse.next();
    }

    if (!isPublicRoute) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });
        const isExpired = token?.accessTokenExpires
            ? (token?.accessTokenExpires as number) * 1000 < Date.now()
            : true;

        if (!token || isExpired) {
            const response = NextResponse.redirect(
                new URL('/sign-in', request.url),
            );

            if (token) {
                response.cookies.delete('next-auth.session-token');
                response.cookies.delete('__Secure-next-auth.session-token');
                response.cookies.delete('auth-token');
            }
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    // Aplica a todas as rotas exceto as explicitamente listadas
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
