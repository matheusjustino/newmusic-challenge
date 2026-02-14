'use client';

import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// HOOKS
import { useSignIn } from './use-sign-in';

// COMPONENTS
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';

const SignInPage: NextPage = () => {
    const { form, handleLogin, isLoading } = useSignIn();

    return (
        <div className="border-2 max-w-[480px] max-h-[720px] p-6 w-full rounded-md shadow-md">
            <div className="w-full flex items-center justify-center gap-3">
                <Link href="/" className="w-14 h-14">
                    <Image
                        fill
                        quality={100}
                        priority
                        src="/assets/images/logo.jpeg"
                        alt="NewMusic logo"
                        className="max-h-14! max-w-14 object-cover relative!"
                    />
                </Link>

                <h1 className="font-semibold text-3xl">Sign in!</h1>
            </div>

            <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="flex flex-col pt-6 gap-3"
            >
                <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    register={form.register('email', { required: true })}
                    errors={form.formState.errors}
                />
                <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    register={form.register('password', { required: true })}
                    errors={form.formState.errors}
                />
                <Button loading={isLoading} disabled={isLoading}>
                    Sign in
                </Button>
                <Button asChild variant="outline" className="text-[13px]">
                    <Link href={'/sign-up'}>Create an account</Link>
                </Button>
            </form>
        </div>
    );
};

export default SignInPage;
