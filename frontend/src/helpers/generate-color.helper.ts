export const generateColorsForItems = (
    items: { name?: string; state?: string }[],
): Record<string, string> => {
    const colors: Record<string, string> = {};
    const total = items.length;

    items.forEach((item, index) => {
        const key = (item.name ?? item.state ?? 'other').toLowerCase();

        // Distribui o hue no círculo (0-360)
        const hue = Math.round((360 / total) * index);

        // Saturação e luminosidade fixas para cores vivas
        const saturation = 80; // % saturação (ex: 80%)
        const lightness = 50; // % luminosidade (ex: 50%)

        colors[key] = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });

    return colors;
};
