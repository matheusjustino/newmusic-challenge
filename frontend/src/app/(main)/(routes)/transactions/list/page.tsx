'use client';

import { NextPage } from 'next';
import { Controller } from 'react-hook-form';

import { useTransactionsList } from './use-transactions-list';

// COMPONENTS
import { TransactionListTable } from './_components/transaction-list-table';
import { PaginationControls } from '@/components/ui/pagination-controls';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const TransactionListPage: NextPage = () => {
    const {
        transactions,
        categories,
        page,
        handleNavigate,
        isLoading,
        // view hook state/handlers
        selected,
        editOpen,
        deleteOpen,
        setEditOpen,
        setDeleteOpen,
        form,
        openEdit,
        openDelete,
        handleSubmit,
        handleConfirmDelete,
        isUpdating,
        isDeleting,
    } = useTransactionsList();

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Transaction List</h1>
            <TransactionListTable
                transactions={transactions.data}
                categories={categories}
                isLoading={isLoading}
                onEdit={openEdit}
                onDelete={openDelete}
            />
            <PaginationControls
                currentPage={page}
                totalPages={transactions.meta.totalPages}
                onPageChange={handleNavigate}
                isFetching={isLoading}
            />

            {/* Edit Transaction Sheet */}
            <Sheet open={editOpen} onOpenChange={setEditOpen}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Edit transaction</SheetTitle>
                    </SheetHeader>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-4 px-4"
                    >
                        <Input
                            id="description"
                            placeholder="Description"
                            label="Description"
                            register={form.register('description', {
                                required: false,
                            })}
                            errors={form.formState.errors}
                        />

                        <Input
                            id="amount"
                            placeholder="Amount"
                            type="numeric"
                            label="Amount"
                            register={form.register('amount', {
                                required: false,
                            })}
                            errors={form.formState.errors}
                        />

                        {/* Category */}
                        <div className="flex flex-col gap-2">
                            <label className="block w-full text-black dark:text-white">
                                Category
                            </label>
                            <Controller
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup className="max-h-56">
                                                    <SelectLabel>
                                                        Categories
                                                    </SelectLabel>
                                                    {categories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.id
                                                                }
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        {form.formState.errors?.categoryId && (
                                            <span className="text-xs text-red-400">
                                                {form.formState.errors.categoryId.message?.toString() ??
                                                    'Error'}
                                            </span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {/* Date */}
                        <Input
                            id="date"
                            type="date"
                            placeholder="Date"
                            label="Date"
                            register={form.register('date', { required: true })}
                            errors={form.formState.errors}
                        />

                        {/* isExtra */}
                        <div className="flex items-center gap-2 w-fit">
                            <label
                                htmlFor="isExtra"
                                className="text-md font-medium cursor-pointer whitespace-nowrap"
                            >
                                Is Extra?
                            </label>

                            <Input
                                id="isExtra"
                                name="isExtra"
                                type="checkbox"
                                className="cursor-pointer h-4 w-4"
                                register={form.register('isExtra')}
                                errors={form.formState.errors}
                            />
                        </div>

                        {/* Type */}
                        <Controller
                            name="type"
                            control={form.control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-6">
                                        {/* Expense */}
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="expense"
                                                checked={
                                                    field.value === 'expense'
                                                }
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value,
                                                    )
                                                }
                                                className={`
                                                    appearance-none h-4 w-4 border border-gray-300 rounded-full
                                                    checked:bg-primary checked:border-primary
                                                    focus:ring-2 focus:ring-primary/20 focus:outline-none
                                                    transition-colors cursor-pointer
                                                `}
                                            />
                                            <span className="text-sm">
                                                Expense
                                            </span>
                                        </label>

                                        {/* Income */}
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="income"
                                                checked={
                                                    field.value === 'income'
                                                }
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value,
                                                    )
                                                }
                                                className={`
                                                    appearance-none h-4 w-4 border border-gray-300 rounded-full
                                                    checked:bg-primary checked:border-primary
                                                    focus:ring-2 focus:ring-primary/20 focus:outline-none
                                                    transition-colors cursor-pointer
                                                `}
                                            />
                                            <span className="text-sm">
                                                Income
                                            </span>
                                        </label>
                                    </div>
                                    {form.formState.errors?.type && (
                                        <span className="text-xs text-red-400">
                                            {form.formState.errors.type.message?.toString() ??
                                                'Error'}
                                        </span>
                                    )}
                                </div>
                            )}
                        />
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

            {/* Delete Transaction Sheet */}
            <Sheet open={deleteOpen} onOpenChange={setDeleteOpen}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Delete transaction</SheetTitle>
                    </SheetHeader>
                    <div className="px-4">
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete
                            {selected ? ` "${selected.description}"` : ''}? This
                            action cannot be undone.
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
                                onClick={handleConfirmDelete}
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

export default TransactionListPage;
