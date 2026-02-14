'use client';

import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

interface BarChartProps<T> {
    data: T[];
    getLabel: (item: T) => string;
    getValue: (item: T) => number;
    title?: string;
    transformValue?: (value: number) => string;
}

export function BarChart<T>({
    data,
    getLabel,
    getValue,
    title,
    transformValue,
}: BarChartProps<T>) {
    const isEmpty = !data || data.length === 0;

    const chartData = {
        labels: data.map(getLabel),
        datasets: [
            {
                label: title ?? '',
                data: data.map(getValue),
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: transformValue
                    ? {
                          callback: function (value: any) {
                              return transformValue(Number(value));
                          },
                      }
                    : {},
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: !!title,
                text: title || '',
            },
            tooltip: transformValue
                ? {
                      callbacks: {
                          label: function (context: any) {
                              const value = context.raw;
                              return transformValue(value);
                          },
                      },
                  }
                : {},
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="h-[300px] w-full flex items-center justify-center"
        >
            {isEmpty ? (
                <span className="text-sm text-muted-foreground">
                    No Data Available
                </span>
            ) : (
                <Bar data={chartData} options={options} />
            )}
        </motion.div>
    );
}
