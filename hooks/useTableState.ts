import { useState } from 'react';

interface UseTableStateProps<T> {
  data: T[];
  itemsPerPage?: number;
  filterFunction: (items: T[], searchTerm: string, filters: Record<string, string>) => T[];
}

export function useTableState<T extends { id: string }>({ 
  data, 
  itemsPerPage = 10, 
  filterFunction 
}: UseTableStateProps<T>) {
  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filtered data - React 19 compiler handles this automatically
  const filteredData = filterFunction(data, searchTerm, filters);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(start, start + itemsPerPage);

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({});
    setCurrentPage(1);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    const visibleIds = paginatedData.map(item => item.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.has(id));

    if (allSelected) {
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        visibleIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    } else {
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        visibleIds.forEach(id => newSet.add(id));
        return newSet;
      });
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const areAllSelected = paginatedData.length > 0 && 
    paginatedData.every(item => selectedIds.has(item.id));

  const hasActiveFilters = searchTerm !== '' || Object.values(filters).some(v => v !== 'All' && v !== '');

  // Pagination controls
  const paginationConfig = totalPages > 1 ? {
    currentPage,
    totalPages,
    totalItems: filteredData.length,
    itemsPerPage,
    onPreviousPage: () => setCurrentPage(prev => Math.max(1, prev - 1)),
    onNextPage: () => setCurrentPage(prev => Math.min(totalPages, prev + 1)),
    onGoToPage: (page: number) => setCurrentPage(page),
    getVisiblePages: () => {
      const pages = [];
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  } : undefined;

  return {
    // Data
    filteredData,
    paginatedData,
    
    // State
    searchTerm,
    filters,
    selectedIds,
    
    // Computed
    hasActiveFilters,
    areAllSelected,
    paginationConfig,
    
    // Handlers
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    toggleSelection,
    toggleSelectAll,
    clearSelection
  };
}
