"use client";

import React from "react";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EmailListTemplateComposition {
  Header: typeof Header;
  Stats: typeof Stats;
  Filters: typeof Filters;
  Table: typeof Table;
}

export const EmailListTemplate: React.FC<{ children: React.ReactNode }> & EmailListTemplateComposition = ({ children }) => {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
};

interface HeaderProps {
  title: string;
  description: string;
  onExport?: () => void;
  onAdd?: () => void;
  exportLabel?: string;
  addLabel?: string;
}

function Header({ title, description, onExport, onAdd, exportLabel = "Export CSV", addLabel = "Add New" }: HeaderProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex space-x-2">
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            {exportLabel}
          </Button>
        )}
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

function Stats({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}

function Filters({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters & Search</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Table({ children, title, itemCount, totalCount, pagination }: { 
  children: React.ReactNode;
  title: string;
  itemCount: number;
  totalCount?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onGoToPage: (page: number) => void;
    getVisiblePages: () => number[];
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {title} ({itemCount}{totalCount && itemCount !== totalCount && ` of ${totalCount}`})
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
                {pagination.getVisiblePages().map((pageNum: number) => (
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

EmailListTemplate.Header = Header;
EmailListTemplate.Stats = Stats;
EmailListTemplate.Filters = Filters;
EmailListTemplate.Table = Table;
