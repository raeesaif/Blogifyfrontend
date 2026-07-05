import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pagination({
    className,
    currentPage,
    hasNext,
    hasPrevious,
    totalCount,
    currentCount,
    onPageChange,
    pageSize,
    isLoading = false,
}) {
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = (currentPage - 1) * pageSize + currentCount;

    return (
        <div className={cn("flex items-center justify-between p-4 border-t", className)}>
            <div className="text-sm text-muted-foreground">
                Showing{" "}
                <strong>
                    {startIndex} to {endIndex}
                </strong>{" "}
                of <strong>{totalCount}</strong> results
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasPrevious || isLoading}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="cursor-pointer disabled:cursor-not-allowed"
                    
                >
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {currentPage}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasNext || isLoading}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="cursor-pointer"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}