import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fadeInDown } from '@/lib/animations';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  value?: string;
  placeholder?: string;
  width?: string;
}

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: FilterConfig[];
  onFilterChange: (key: string, value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  animate?: boolean;
  searchPlaceholder?: string;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  hasActiveFilters,
  onClearFilters,
  animate = true,
  searchPlaceholder = 'Search...',
}) => {
  const content = (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 transition-all duration-200 focus:shadow-md"
        />
      </div>

      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={filter.value ?? 'all'}
          onValueChange={(value) => onFilterChange(filter.key, value)}
        >
          <SelectTrigger className={filter.width || 'w-[140px]'}>
            <SelectValue placeholder={filter.placeholder || filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {filter.label}</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Clear
        </Button>
      )}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        variants={fadeInDown}
        initial="hidden"
        animate="show"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};
