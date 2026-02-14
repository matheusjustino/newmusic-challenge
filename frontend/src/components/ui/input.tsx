import * as React from 'react';
import { FieldErrors, UseFormRegisterReturn } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    register?: UseFormRegisterReturn<string>;
    errors?: FieldErrors;
    icon?: LucideIcon | (() => React.JSX.Element);
    iconSize?: number;
}

function Input({
    className,
    type,
    id,
    label,
    register,
    errors,
    icon: Icon,
    iconSize,
    name,
    ...props
}: InputProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {(label || Icon) && (
                <label
                    className="flex items-center gap-2 text-black dark:text-white"
                    htmlFor={register?.name ?? name}
                >
                    <>
                        {Icon && <Icon size={iconSize ?? 20} />} {label}
                    </>
                </label>
            )}

            <input
                type={type}
                data-slot="input"
                className={cn(
                    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    className,
                )}
                id={id ?? register?.name ?? name}
                name={register?.name ?? name}
                {...props}
                {...register}
            />

            {id && errors && errors[id] && (
                <span className="text-xs text-red-400">
                    {errors[id]?.message?.toString() ?? 'Error'}
                </span>
            )}
        </div>
    );
}

export { Input };
