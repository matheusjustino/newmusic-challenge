'use client';

import { NextPage } from 'next';

import { useCreateCategory } from './use-create-category';

// COMPONENTS
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CreateCategoryPage: NextPage = () => {
    const { form, handleSubmit, isLoading } = useCreateCategory();

    return (
        <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4 w-full md:w-1/2"
        >
            <Input
                id="name"
                placeholder="Name"
                label="Name"
                register={form.register('name', { required: true })}
                errors={form.formState.errors}
            />
            <Input
                id="description"
                placeholder="Description"
                label="Description"
                register={form.register('description', { required: true })}
                errors={form.formState.errors}
            />

            <Button loading={isLoading} disabled={isLoading}>
                Create
            </Button>
        </form>
    );
};

export default CreateCategoryPage;
