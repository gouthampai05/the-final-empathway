// components/shared/DataTable.tsx
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface TableColumn<T> {
  key: keyof T | 'actions' | 'select';
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface TableAction<T> {
  label: string;
  icon: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
  disabled?: (item: T) => boolean;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  selectedIds?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onToggleSelectAll?: () => void;
  areAllSelected?: boolean;
  showSelection?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  actions = [],
  selectedIds = new Set(),
  onToggleSelection,
  onToggleSelectAll,
  areAllSelected = false,
  showSelection = false,
  emptyMessage = "No data available."
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {showSelection && (
              <TableHead className="w-12">
                <Checkbox
                  checked={areAllSelected}
                  onCheckedChange={onToggleSelectAll}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead key={String(column.key)}>
                {column.label}
              </TableHead>
            ))}
            {actions.length > 0 && (
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {showSelection && (
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={() => onToggleSelection?.(item.id)}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render 
                    ? column.render(item) 
                    : String(item[column.key as keyof T] || '')
                  }
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {actions.map((action, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => action.onClick(item)}
                          disabled={action.disabled?.(item)}
                          className={action.variant === 'destructive' ? 'text-red-600' : ''}
                        >
                          <span className="mr-2">{action.icon}</span>
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
