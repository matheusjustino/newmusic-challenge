'use client';

import { signOut } from 'next-auth/react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';

export const LogoutButton: React.FC = () => {
    const handleLogout = useCallback(async () => {
        await signOut({ redirect: true, callbackUrl: '/' });
    }, []);

    return (
        <Button variant="outline" className="w-full" onClick={handleLogout}>
            Logout
        </Button>
    );
};
