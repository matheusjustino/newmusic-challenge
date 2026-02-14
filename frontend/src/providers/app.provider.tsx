'use client';

import '@/lib/chartjs';
import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import { FC, ReactNode, useState } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

// LIBs
import { queryClient } from '../lib/query-client';

interface LayoutProps {
    children: ReactNode;
    pageProps: any;
}

const AppProviders: FC<LayoutProps> = ({ children, pageProps }) => {
    const [QC] = useState(queryClient);

    return (
        <>
            <SonnerToaster
                richColors
                closeButton
                duration={3000}
                position="top-right"
            />
            <NextTopLoader color="#2a2a2a" />
            <QueryClientProvider client={QC} {...pageProps}>
                <SessionProvider {...pageProps}>{children}</SessionProvider>
            </QueryClientProvider>
        </>
    );
};

export { AppProviders };
