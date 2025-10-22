# Global Utilities (lib/)

This directory contains utility functions shared across multiple features (2+).

## Utilities

### `utils.ts`
**Purpose**: Tailwind CSS class merging utility
**Exports**: `cn()` - Combines clsx and tailwind-merge for className composition

### `authErrorMessages.ts`
**Used by**: auth feature
**Purpose**: Maps Supabase auth error codes to user-friendly messages
**Note**: Currently only used by auth - consider moving to `features/auth/utils/` if it stays single-feature

### `contentUtils.ts`
**Used by**: blogs
**Purpose**: Content manipulation utilities (read time calculation, text truncation)
**Note**: Currently only used by blogs - consider moving to `features/blogs/utils/` if it stays single-feature

### `copyToClipboard.ts`
**Used by**: email_list
**Purpose**: Copy text to clipboard with fallback support
**Note**: Generic utility, good candidate for lib/

### `cropImage.ts`
**Used by**: Unknown
**Purpose**: Image cropping utility
**Note**: Verify usage across features

### `exportToCSV.ts`
**Used by**: email_list
**Purpose**: Export data to CSV format
**Note**: Generic utility, good candidate for lib/

### `getCurrentDate.ts`
**Used by**: blogs, email_list
**Purpose**: Get current date in YYYY-MM-DD format
**Shared by**: 2+ features ✓

## When to Add a Utility Here

Only add utilities to this directory when they meet these criteria:
1. Used by 2 or more features
2. Contain NO feature-specific business logic
3. Are pure functions (no side effects)
4. Are truly generic and reusable

If a utility is only used by one feature, keep it in that feature's `utils/` directory.

## Refactoring Needed

The following utilities appear to be single-feature and should be moved:
- `authErrorMessages.ts` → `features/auth/utils/`
- `contentUtils.ts` → `features/blogs/utils/`
