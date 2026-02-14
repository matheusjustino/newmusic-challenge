import { useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

const formSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(1, { message: 'Password must contain at least 1 character(s)' }),
});

type FormType = z.infer<typeof formSchema & FieldValues>;

export const useSignIn = () => {
    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        values: {
            email: 'teste@email.com',
            password: '123',
        },
    });
    const signInMutation = useMutation({
        mutationKey: ['sign-in'],
        mutationFn: async (data: FormType) => {
            const result = await signIn(`credentials`, {
                ...data,
                redirect: false,
            });

            if (!result?.ok) {
                throw result?.error;
            }

            return result;
        },
    });

    const handleLogin: SubmitHandler<FormType> = useCallback(
        async (data, event) => {
            event?.preventDefault();

            try {
                toast.promise(signInMutation.mutateAsync(data), {
                    loading: `Submitting...`,
                    success: `Logged in successfully`,
                    error: (err) => {
                        const errorMsg = err?.message ? err.message : err;
                        return typeof errorMsg === 'string'
                            ? errorMsg
                            : `Something went wrong`;
                    },
                });
            } catch (error) {
                console.error(error);
            }
        },
        [],
    );

    return {
        form,
        handleLogin,
        isLoading: signInMutation.isPending,
    };
};
