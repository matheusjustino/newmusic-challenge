import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isFetching: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    isFetching,
}) => {
    return (
        <div className="flex items-center justify-center gap-4 mt-4">
            <Button
                variant="outline"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isFetching}
            >
                Anterior
            </Button>
            <span>
                Página {currentPage} de {totalPages}
            </span>
            <Button
                variant="outline"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isFetching}
            >
                Próxima
            </Button>
        </div>
    );
};
