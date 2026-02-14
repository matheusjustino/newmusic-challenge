import { TransactionInterface } from '@/interfaces/transactions/transaction.interface';
import { CategoryInterface } from '@/interfaces/categories/category.interface';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Spinner } from '@/components/spinner';
import { Pencil, Trash2 } from 'lucide-react';

interface TransactionListTableProps {
    transactions: TransactionInterface[];
    categories: CategoryInterface[];
    isLoading: boolean;
    onEdit?: (transaction: TransactionInterface) => void;
    onDelete?: (transaction: TransactionInterface) => void;
}

const TransactionListTable: React.FC<TransactionListTableProps> = ({
    transactions,
    categories,
    isLoading = false,
    onEdit,
    onDelete,
}) => {
    const categoriesMap = new Map(
        categories.map((category) => [category.id, category]),
    );

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center py-16">
                            <div className="flex w-full justify-center items-center">
                                <Spinner />
                            </div>
                        </TableCell>
                    </TableRow>
                ) : transactions.length > 0 ? (
                    transactions.map((transaction) => {
                        return (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.id}</TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>{transaction.amount}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>
                                    {
                                        categoriesMap.get(
                                            transaction.categoryId,
                                        )?.name
                                    }
                                </TableCell>
                                <TableCell>
                                    <TableCell className="flex gap-2">
                                        <Trash2
                                            className="cursor-pointer h-5 w-5"
                                            onClick={() =>
                                                onDelete?.(transaction)
                                            }
                                        />
                                        <Pencil
                                            className="cursor-pointer h-5 w-5"
                                            onClick={() =>
                                                onEdit?.(transaction)
                                            }
                                        />
                                    </TableCell>
                                </TableCell>
                            </TableRow>
                        );
                    })
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={8}
                            className="text-center py-8 text-gray-500"
                        >
                            No transactions found
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

TransactionListTable.displayName = 'TransactionListTable';

export { TransactionListTable };
