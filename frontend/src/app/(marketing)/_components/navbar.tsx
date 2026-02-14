import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// LIBS
import { getAuthSession } from '../../../lib/nextauth';

// COMPONENTS
import { Button } from '../../../components/ui/button';

const Navbar: React.FC = async () => {
    const authSession = await getAuthSession();

    return (
        <div className="top-0 w-full h-14 px-4 border-b shadow-sm bg-white/60 backdrop-blur-sm flex items-center">
            <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
                <div className="relative flex items-center gap-2">
                    <Link href="/">
                        <Image
                            className="max-h-12! min-w-12 object-cover relative!"
                            src={'/assets/images/logo.jpeg'}
                            quality={100}
                            priority
                            alt="NewMusic Logo"
                            fill
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {authSession?.user ? (
                        <Button asChild variant="outline" size="sm">
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <Fragment>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/sign-in">Login</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href="/sign-up">Register</Link>
                            </Button>
                        </Fragment>
                    )}
                </div>
            </div>
        </div>
    );
};

export { Navbar };
