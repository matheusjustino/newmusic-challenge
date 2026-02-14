'use client';

import { NextPage } from 'next';
import { Controller } from 'react-hook-form';

import { useTransactionsCreate } from './use-transactions-create';
import { TransactionTypeEnum } from '@/enums/transaction-type.enum';

// COMPONENTS
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

const CreateTransactionPage: NextPage = () => {
    const { form, handleSubmit, isLoading, categories } =
        useTransactionsCreate();

    return (
        <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4 w-full md:w-1/2"
        >
            <Input
                id="description"
                placeholder="Description"
                label="Description"
                register={form.register('description', { required: true })}
                errors={form.formState.errors}
            />
            <Input
                id="amount"
                placeholder="Amount"
                type="numeric"
                label="Amount"
                register={form.register('amount', { required: true })}
                errors={form.formState.errors}
            />

            {/** Category */}
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
                                        <SelectLabel>Categories</SelectLabel>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {form.formState.errors &&
                                form.formState.errors.categoryId && (
                                    <span className="text-xs text-red-400">
                                        {form.formState.errors.categoryId?.message?.toString() ??
                                            'Error'}
                                    </span>
                                )}
                        </>
                    )}
                />
            </div>

            <Input
                id="date"
                type="date"
                placeholder="Date"
                label="Date"
                register={form.register('date', { required: true })}
                errors={form.formState.errors}
            />

            {/** isExtra */}
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
                    register={form.register('isExtra', { required: true })}
                    errors={form.formState.errors}
                />
            </div>

            {/** Type */}
            <Controller
                name="type"
                control={form.control}
                defaultValue={TransactionTypeEnum.EXPENSE} // ← ESSENCIAL: evita undefined
                render={({ field }) => (
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-6">
                            {/* Expense */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="expense"
                                    checked={field.value === 'expense'}
                                    onChange={(e) =>
                                        field.onChange(e.target.value)
                                    }
                                    className={`
                                        appearance-none h-4 w-4 border border-gray-300 rounded-full
                                        checked:bg-primary checked:border-primary
                                        focus:ring-2 focus:ring-primary/20 focus:outline-none
                                        transition-colors cursor-pointer
                                    `}
                                />
                                <span className="text-sm">Expense</span>
                            </label>

                            {/* Income */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="income"
                                    checked={field.value === 'income'}
                                    onChange={(e) =>
                                        field.onChange(e.target.value)
                                    }
                                    className={`
                                        appearance-none h-4 w-4 border border-gray-300 rounded-full
                                        checked:bg-primary checked:border-primary
                                        focus:ring-2 focus:ring-primary/20 focus:outline-none
                                        transition-colors cursor-pointer
                                    `}
                                />
                                <span className="text-sm">Income</span>
                            </label>
                        </div>
                    </div>
                )}
            />

            <Button loading={isLoading} disabled={isLoading}>
                Create
            </Button>
        </form>
    );
};

export default CreateTransactionPage;
