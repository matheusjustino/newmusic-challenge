'use client';

import { useEffect, useRef, useState } from 'react';
import { format, differenceInDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface Props {
    onChange?: (range: DateRange) => void;
}

export const DateRangeFilter: React.FC<Props> = ({ onChange }) => {
    const todayRef = useRef<Date>(new Date());
    const defaultFromRef = useRef<Date>(subDays(todayRef.current, 30));

    const [range, setRange] = useState<DateRange>({
        from: defaultFromRef.current,
        to: todayRef.current,
    });

    useEffect(() => {
        onChange?.({
            from: defaultFromRef.current,
            to: todayRef.current,
        });
    }, []);

    function handleSelect(selected: DateRange) {
        if (!selected?.from || !selected?.to) {
            setRange(selected);
            return;
        }

        const diff = differenceInDays(selected.to, selected.from);

        // 🔒 Limite máximo 30 dias
        if (diff > 30) return;

        setRange(selected);
        onChange?.(selected);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full md:w-[280px] justify-start text-left font-normal"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {range?.from && range?.to && (
                        <>
                            {format(range.from, 'dd/MM/yyyy', {
                                locale: ptBR,
                            })}{' '}
                            -{' '}
                            {format(range.to, 'dd/MM/yyyy', {
                                locale: ptBR,
                            })}
                        </>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    mode="range"
                    required
                    selected={range}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                    locale={ptBR}
                    disabled={(date) => {
                        // Bloqueia datas futuras
                        if (date > todayRef.current) return true;

                        // Bloqueia intervalo maior que 30 dias:
                        // 1) quando já existe 'from', limita datas acima de 30 dias a partir de 'from'
                        if (
                            range?.from &&
                            differenceInDays(date, range.from) > 30
                        )
                            return true;
                        // 2) quando já existe 'to', limita datas abaixo de 30 dias antes de 'to'
                        if (range?.to && differenceInDays(range.to, date) > 30)
                            return true;

                        return false;
                    }}
                />
            </PopoverContent>
        </Popover>
    );
};
