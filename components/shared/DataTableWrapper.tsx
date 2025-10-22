// components/shared/DataTableWrapper.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaginationConfig } from "@/types/PaginationConfig";

interface DataTableWrapperProps {
  title: string;
  itemCount: number;
  totalCount: number;
  pagination?: PaginationConfig;
  children: React.ReactNode;
}

export function DataTableWrapper({
  title,
  itemCount,
  totalCount,
  pagination,
  children
}: DataTableWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {title} ({itemCount}{itemCount !== totalCount && ` of ${totalCount}`})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
        
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
              {pagination.totalItems} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={pagination.onPreviousPage}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {pagination.getVisiblePages().map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pagination.currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8"
                    onClick={() => pagination.onGoToPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={pagination.onNextPage}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
