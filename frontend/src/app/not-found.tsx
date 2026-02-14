import { NextPage } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';

// COMPONENTS
import { Button } from '../components/ui/button';

const NotFoundPage: NextPage = async () => {
    const referer = (await headers()).get('referer') || '/';

    return (
        <div className="max-w-xl mx-auto p-4 min-h-screen flex flex-col gap-3 items-center justify-center">
            <h1 className="font-semibold text-5xl">Ops...</h1>

            <h2 className="font-medium text-muted-foreground text-2xl">
                This page may have been deleted
            </h2>

            <Button asChild className="w-full">
                <Link href={referer}>Back</Link>
            </Button>

            <Button asChild className="w-full">
                <Link href="/">Home</Link>
            </Button>
        </div>
    );
};

export default NotFoundPage;
