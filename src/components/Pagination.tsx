import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils";
import { getVisiblePages } from "@/utils/getVisiblePages";

type Props = {
  updatePage: (currentPage: number) => void;
  currentPage: number;
  totalPages?: number;
}

export function PaginationClients({ currentPage, updatePage, totalPages = 1 }: Props) {
  const handlePrev = () => {
    if (currentPage > 1) {
      updatePage(currentPage - 1);
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      updatePage(currentPage + 1);
    }
  }

  const isMobile = window.innerWidth <= 640;
  const pages = getVisiblePages(currentPage, totalPages, isMobile);

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <Pagination className="flez justify-end">
      <PaginationContent className="gap-3">
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              isPrevDisabled && "pointer-events-none opacity-50",
              "hover:bg-[var(--primary)] hover:text-white"
            )}
            onClick={handlePrev} />
        </PaginationItem>

        <div className="flex justify-center min-w-[150px] sm:w-[300px]">
          {pages.map((page, i) => (
            <PaginationItem key={i}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  className={cn(
                    currentPage === page
                      ? "bg-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-white"
                      : "hover:bg-[var(--primary)] hover:text-white"
                  )}
                  isActive={currentPage === page}
                  onClick={() => updatePage(page)}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem>
          <PaginationNext
            className={cn(
              isNextDisabled && "pointer-events-none opacity-50",
              "hover:bg-[var(--primary)] hover:text-white"
            )}
            onClick={handleNext}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
