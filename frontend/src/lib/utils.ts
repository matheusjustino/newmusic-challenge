import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const currencyFormatter = (
    locales: Intl.LocalesArgument = 'pt-BR',
    options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'BRL',
    },
) => new Intl.NumberFormat(locales, options);
