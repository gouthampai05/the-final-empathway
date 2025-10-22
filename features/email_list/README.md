# Email List Feature

The email list feature provides functionality for managing email campaigns and subscriber lists with Brevo (formerly Sendinblue) email service integration. It follows a modular architecture for maintainability and scalability.

## Quick Start

### Prerequisites
1. Brevo account (sign up at [brevo.com](https://www.brevo.com))
2. Verified sender email in Brevo
3. Brevo API key

### Setup
1. Add required environment variables to `.env`:
   ```env
   BREVO_API_KEY=your_api_key_here
   BREVO_SENDER_EMAIL=noreply@yourdomain.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
2. See [BREVO_INTEGRATION.md](./BREVO_INTEGRATION.md) for detailed setup instructions

### Email Service
The feature uses Brevo's Transactional Email API to send campaigns with:
- Batch processing (50 recipients per batch)
- Rate limiting (1 second between batches)
- Beautiful HTML email templates
- Campaign tracking and analytics

## Directory Structure

```
email_list/
  ├── components/         # React components
  │   ├── campaign/      # Campaign-specific components
  │   ├── subscriber/    # Subscriber-specific components
  │   └── shared/        # Shared components
  ├── config/            # Feature configurations
  │   ├── campaign/      # Campaign-specific configs
  │   └── subscriber/    # Subscriber-specific configs
  ├── data/              # Mock data and constants
  ├── hooks/             # Custom React hooks
  ├── pages/             # Page components
  ├── services/          # API and business logic
  ├── types/             # TypeScript types
  ├── utils/             # Helper functions
  └── validations/       # Schema validations
```

## Key Components

### Campaign Management

- `CampaignPage`: Main page for managing email campaigns
- `CampaignForm`: Form for creating/editing campaigns
- `CampaignTable`: Display and manage campaign list

### Configuration

Campaign configurations are split into:
- Form fields (`formConfig.ts`)
- Table columns (`tableConfig.ts`)
- Filters (`filterConfig.ts`)
- Stats display (`statsConfig.tsx`)

### Hooks

- `useCampaignManager`: Manages campaign CRUD operations
- `useCampaignFormDialog`: Handles campaign form state and dialogs

### Services

- `CampaignService`: Business logic for campaign operations
- `SubscriberService`: Subscriber management operations
- `BrevoService`: Email sending via Brevo API (see [BREVO_INTEGRATION.md](./BREVO_INTEGRATION.md))
- Includes validation and error handling

### Types

- `Campaign`: Main campaign interface
- `CampaignFormData`: Form data structure
- `FilterState`: Filter and search types

## Usage

```typescript
// Example: Using campaign manager hook
const campaignManager = useCampaignManager(initialData);

// Create a new campaign
await campaignManager.createCampaign({
  name: "Welcome Series",
  subject: "Welcome!",
  content: "..."
});

// Update a campaign
await campaignManager.updateCampaign(id, {
  name: "Updated Welcome Series",
  ...data
});
```

## Testing

Each module can be tested independently:
- Components using React Testing Library
- Hooks using custom hook testing utilities
- Services using unit tests
- Utils using pure function tests

## Best Practices

1. Keep components focused and single-responsibility
2. Use TypeScript for type safety
3. Implement proper error handling
4. Follow consistent naming conventions
5. Document complex functions and components
