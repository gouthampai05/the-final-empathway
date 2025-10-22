# Global Types

This directory contains TypeScript type definitions shared across multiple features (2+).

## Types

### `FilterConfig.ts`
**Used by**: email_list (campaigns, subscribers)
**Purpose**: Configuration interface for filter dropdowns
**Shared by**: Multiple sub-features within email_list

### `PaginationConfig.ts`
**Used by**: email_list, potentially other features with tables
**Purpose**: Pagination state and configuration
**Shared by**: Table components across features

### `StatCard.ts`
**Used by**: email_list, potentially dashboards
**Purpose**: Statistics card interface for metrics display
**Shared by**: Dashboard and stats components

## When to Add a Type Here

Only add types to this directory when they meet these criteria:
1. Used by 2 or more features
2. Represent truly generic, cross-cutting concerns (not feature-specific domain models)
3. Are infrastructure/UI types (pagination, filters, forms) rather than business domain types

Feature-specific domain types (Blog, Campaign, Subscriber, User, etc.) should stay in their respective `features/*/types/` directories.
