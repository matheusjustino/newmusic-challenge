import { CategoryInterface } from '@/interfaces/categories/category.interface';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';

interface CategoryListTableProps {
    categories: CategoryInterface[];
    onEdit?: (category: CategoryInterface) => void;
    onDelete?: (category: CategoryInterface) => void;
}

const CategoryListTable: React.FC<CategoryListTableProps> = ({
    categories,
    onEdit,
    onDelete,
}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {categories.map((category) => {
                    return (
                        <TableRow key={category.id}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{category.description}</TableCell>
                            <TableCell className="flex gap-2">
                                <Trash2
                                    className="cursor-pointer h-5 w-5"
                                    onClick={() => onDelete?.(category)}
                                />
                                <Pencil
                                    className="cursor-pointer h-5 w-5"
                                    onClick={() => onEdit?.(category)}
                                />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

CategoryListTable.displayName = 'CategoryListTable';

export { CategoryListTable };
