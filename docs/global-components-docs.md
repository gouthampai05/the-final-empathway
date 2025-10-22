# Global Components, Hooks, and Utilities Documentation

## Table of Contents
1. [Shared Components](#shared-components)
   - [DataTable](#datatable)
   - [DataTableWrapper](#datatablewrapper)
   - [EntityForm](#entityform)
2. [Global Hooks](#global-hooks)
   - [useFormSubmission](#useformsubmission)
   - [useTableState](#usetablestate)
3. [Utility Libraries](#utility-libraries)

## Shared Components

### DataTable
A flexible and reusable table component that supports selection, actions, and custom column rendering.

#### Props
```typescript
interface DataTableProps<T extends { id: string }> {
  data: T[];                           // Array of items to display
  columns: TableColumn<T>[];           // Column configuration
  actions?: TableAction<T>[];          // Row actions
  selectedIds?: Set<string>;          // Set of selected row IDs
  onToggleSelection?: (id: string) => void;  // Selection handler
  onToggleSelectAll?: () => void;     // Select all handler
  areAllSelected?: boolean;           // Whether all items are selected
  showSelection?: boolean;            // Show selection checkboxes
  emptyMessage?: string;              // Message when no data
}
```

#### Column Configuration
```typescript
interface TableColumn<T> {
  key: keyof T | 'actions' | 'select';  // Property key from data item
  label: string;                        // Column header label
  render?: (item: T) => React.ReactNode; // Custom render function
  sortable?: boolean;                    // Whether column is sortable
}
```

#### Action Configuration
```typescript
interface TableAction<T> {
  label: string;                      // Action label in dropdown
  icon: React.ReactNode;             // Action icon
  onClick: (item: T) => void;        // Action handler
  variant?: 'default' | 'destructive'; // Action style
  disabled?: (item: T) => boolean;    // Disable condition
}
```

#### Example Usage
```tsx
<DataTable
  data={users}
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (user) => <Badge>{user.status}</Badge>
    }
  ]}
  actions={[
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (user) => handleEdit(user)
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (user) => handleDelete(user),
      variant: 'destructive'
    }
  ]}
  showSelection={true}
  selectedIds={selectedUsers}
  onToggleSelection={handleToggleUser}
  onToggleSelectAll={handleToggleAll}
/>
```

### DataTableWrapper
A wrapper component that provides a consistent card layout and pagination for data tables.

#### Props
```typescript
interface DataTableWrapperProps {
  title: string;            // Table title
  itemCount: number;        // Number of items currently shown
  totalCount: number;       // Total number of items
  pagination?: PaginationConfig; // Pagination configuration
  children: React.ReactNode; // Table content
}
```

#### Example Usage
```tsx
<DataTableWrapper
  title="Users"
  itemCount={paginatedUsers.length}
  totalCount={totalUsers}
  pagination={paginationConfig}
>
  <DataTable data={paginatedUsers} columns={columns} />
</DataTableWrapper>
```

### EntityForm
A reusable form component for creating and editing entities with dynamic field configuration.

#### Props
```typescript
interface EntityFormProps<T> {
  open: boolean;                          // Dialog visibility
  onOpenChange: (open: boolean) => void;  // Dialog visibility handler
  title: string;                          // Form title
  description: string;                    // Form description
  fields: FormField[];                    // Form field configuration
  formData: T;                            // Form data
  onFormDataChange: (updates: Partial<T>) => void; // Form data update handler
  onSubmit: () => void;                   // Form submission handler
  onCancel: () => void;                   // Cancel handler
  isLoading: boolean;                     // Loading state
  submitText: string;                     // Submit button text
}
```

#### Field Configuration
```typescript
interface FormField {
  name: string;    // Field name (matches formData key)
  label: string;   // Field label
  type: 'text' | 'email' | 'select' | 'textarea' | 'multiselect' | 'datetime-local';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select/multiselect
}
```

#### Example Usage
```tsx
<EntityForm
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Create User"
  description="Add a new user to the system"
  fields={[
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' }
      ]
    }
  ]}
  formData={formData}
  onFormDataChange={handleFormChange}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isLoading={isSubmitting}
  submitText="Create User"
/>
```

## Global Hooks

### useFormSubmission
A hook for managing form submission state including loading and error handling.

#### Returns
```typescript
{
  loading: boolean;        // Form submission loading state
  error: string;          // Error message if submission failed
  submitForm: (submitFn: () => Promise<void>) => Promise<void>; // Submission wrapper
}
```

#### Example Usage
```typescript
const { loading, error, submitForm } = useFormSubmission();

const handleSubmit = async (data) => {
  await submitForm(async () => {
    const result = await authenticateUser(data);
    if (!result.success) {
      throw new Error(result.error);
    }
    router.push(result.redirectTo);
  });
};
```

### useTableState
A hook for managing table state including pagination, filtering, and selection.

#### Props
```typescript
interface UseTableStateProps<T> {
  data: T[];                  // Full dataset
  itemsPerPage?: number;      // Items per page (default: 10)
  filterFunction: (        // Custom filter function
    items: T[],
    searchTerm: string,
    filters: Record<string, string>
  ) => T[];
}
```

#### Returns
```typescript
{
  // Data
  filteredData: T[];          // Filtered dataset
  paginatedData: T[];         // Current page data
  
  // State
  searchTerm: string;         // Current search term
  filters: Record<string, string>; // Active filters
  selectedIds: Set<string>;   // Selected row IDs
  
  // Computed
  hasActiveFilters: boolean;  // Whether any filters are active
  areAllSelected: boolean;    // Whether all visible items are selected
  paginationConfig: {         // Pagination configuration
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onGoToPage: (page: number) => void;
    getVisiblePages: () => number[];
  };
  
  // Handlers
  handleSearchChange: (value: string) => void;
  handleFilterChange: (key: string, value: string) => void;
  handleClearFilters: () => void;
  toggleSelection: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
}
```

#### Example Usage
```typescript
const tableState = useTableState({
  data: users,
  itemsPerPage: 10,
  filterFunction: (items, search, filters) => {
    return items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (!filters.role || item.role === filters.role)
    );
  }
});

return (
  <DataTableWrapper
    title="Users"
    itemCount={tableState.paginatedData.length}
    totalCount={tableState.filteredData.length}
    pagination={tableState.paginationConfig}
  >
    <DataTable
      data={tableState.paginatedData}
      columns={columns}
      selectedIds={tableState.selectedIds}
      onToggleSelection={tableState.toggleSelection}
      onToggleSelectAll={tableState.toggleSelectAll}
      areAllSelected={tableState.areAllSelected}
    />
  </DataTableWrapper>
);
```

## Utility Libraries

### copyToClipboard.ts
Utility for copying text to clipboard.

### exportToCSV.ts
Utility for exporting data to CSV format.

### getCurrentDate.ts
Utility for getting current date in ISO format without milliseconds.

```typescript
getCurrentDate(): string // Returns: YYYY-MM-DDTHH:mm:ss
```

### utils.ts
General utility functions including:

#### cn (className utility)
Combines class names using clsx and tailwind-merge for optimal class merging.

```typescript
cn(...inputs: ClassValue[]): string
```

Example:
```typescript
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === 'large' && "large-class"
)}>
```
