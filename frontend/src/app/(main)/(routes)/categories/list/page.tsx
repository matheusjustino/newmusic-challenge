'use client';

import { NextPage } from 'next';

import { useCategoryStore } from '@/stores/category.store';

import { CategoryListTable } from './_components/category-list-table';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCategoriesList } from './use-categories-list';

const CategoryListPage: NextPage = () => {
    const { categories } = useCategoryStore();
    const {
        form,
        selected,
        editOpen,
        deleteOpen,
        setEditOpen,
        setDeleteOpen,
        openEdit,
        openDelete,
        handleSubmit,
        confirmDelete,
        isDeleting,
        isUpdating,
    } = useCategoriesList();

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <CategoryListTable
                categories={categories}
                onEdit={openEdit}
                onDelete={openDelete}
            />

            {/* Edit Sheet */}
            <Sheet open={editOpen} onOpenChange={setEditOpen}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Edit category</SheetTitle>
                    </SheetHeader>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-4 px-4"
                    >
                        <Input
                            id="name"
                            placeholder="Name"
                            label="Name"
                            register={form.register('name', { required: true })}
                            errors={form.formState.errors}
                        />
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-sm font-medium"
                                htmlFor="description"
                            >
                                Description
                            </label>
                            <Textarea
                                id="description"
                                placeholder="Description"
                                rows={4}
                                aria-invalid={
                                    !!form.formState.errors?.description
                                }
                                {...form.register('description', {
                                    required: true,
                                })}
                            />
                            {form.formState.errors?.description && (
                                <span className="text-xs text-red-400">
                                    {form.formState.errors.description.message?.toString() ??
                                        'Error'}
                                </span>
                            )}
                        </div>
                        <SheetFooter>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setEditOpen(false)}
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={isUpdating}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Delete Sheet */}
            <Sheet open={deleteOpen} onOpenChange={setDeleteOpen}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Delete category</SheetTitle>
                    </SheetHeader>
                    <div className="px-4">
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete
                            {selected ? ` "${selected.name}"` : ''}? This action
                            cannot be undone.
                        </p>
                    </div>
                    <SheetFooter>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                loading={isDeleting}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default CategoryListPage;
