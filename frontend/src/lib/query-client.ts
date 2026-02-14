import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // staleTime: 60 * 1000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: 2,
        },
    },
});
