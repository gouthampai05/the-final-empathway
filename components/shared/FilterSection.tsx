// components/shared/FilterSection.tsx
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FilterConfig } from "@/types/FilterConfig";

interface FilterSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters: Record<string, string>;
  filterConfigs: FilterConfig[];
  onFilterChange: (key: string, value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  additionalActions?: React.ReactNode;
}

export function FilterSection({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  filterConfigs,
  onFilterChange,
  hasActiveFilters,
  onClearFilters,
  additionalActions
}: FilterSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters & Search</CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear Filters
              </Button>
            )}
            {additionalActions}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {filterConfigs.map(config => (
            <Select
              key={config.key}
              value={filters[config.key] || 'All'}
              onValueChange={(value) => onFilterChange(config.key, value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={config.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {config.options.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
