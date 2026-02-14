import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

// SERVICES
import { registerUser } from '../../../../services/auth.service';

const formSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z
        .string()
        .min(1, { message: 'Password must contain at least 1 character(s)' }),
});

type FormType = z.infer<typeof formSchema & FieldValues>;

export const useSignUp = () => {
    const router = useRouter();

    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        values: {
            email: 'teste@email.com',
            name: 'Teste',
            password: '123',
        },
    });
    const signUpMutation = useMutation({
        mutationKey: ['sign-up'],
        mutationFn: async (data: FormType) => {
            return await registerUser(data);
        },
    });

    const handleRegister: SubmitHandler<FormType> = useCallback(
        async (data, event) => {
            event?.preventDefault();

            try {
                toast.promise(signUpMutation.mutateAsync(data), {
                    loading: `Submitting...`,
                    success: () => {
                        form.reset();
                        router.push('/sign-in');
                        return `Account created successfully`;
                    },
                    error: (err) => {
                        console.error(err.response);
                        const errMsg =
                            err?.response?.data?.message ??
                            err?.message ??
                            `Something went wrong`;
                        return errMsg;
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
        handleRegister,
        isLoading: signUpMutation.isPending,
    };
};
