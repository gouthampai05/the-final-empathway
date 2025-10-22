# Global Hooks

This directory contains React hooks that are shared across multiple features (2+).

## Hooks

### `useFormSubmission`
**Used by**: auth, email_list
**Purpose**: Standardized form submission handling with loading states and error management

### `useTableState`
**Used by**: email_list (campaigns and subscribers)
**Purpose**: Generic table state management including:
- Pagination
- Search/filtering
- Row selection
- Sorted data

## When to Add a Hook Here

Only add hooks to this directory when they meet these criteria:
1. Used by 2 or more features
2. Contain NO feature-specific business logic
3. Are truly generic and reusable

If a hook is only used by one feature, keep it in that feature's `hooks/` directory.
