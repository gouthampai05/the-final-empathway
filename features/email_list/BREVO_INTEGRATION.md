# Brevo Email Integration Guide

This document explains how the Brevo (formerly Sendinblue) email service is integrated into the EmpathWay email campaign feature.

## Overview

The email campaign system uses Brevo's Transactional Email API to send email campaigns to subscribers. The integration is fully implemented and ready to use once you configure your Brevo account.

## Features

- Send email campaigns to filtered subscriber lists
- Batch processing (50 recipients per batch to respect API limits)
- Rate limiting (1 second delay between batches)
- Beautiful HTML email templates with author information
- Campaign status tracking (Draft, Scheduled, Sending, Sent, Failed)
- Recipient filtering by status, source, and tags
- Unsubscribe and preference management links

## Setup Instructions

### 1. Create a Brevo Account

1. Go to [https://www.brevo.com](https://www.brevo.com)
2. Sign up for a free account (up to 300 emails/day on free tier)
3. Verify your email address

### 2. Get Your API Key

1. Log in to your Brevo dashboard
2. Navigate to **Settings** → **API Keys** or go directly to [https://app.brevo.com/settings/keys/api](https://app.brevo.com/settings/keys/api)
3. Click **Generate a new API key**
4. Give it a name (e.g., "EmpathWay Production")
5. Copy the generated API key

### 3. Set Up Sender Email

1. Go to **Settings** → **Senders & IP** or [https://app.brevo.com/settings/senders](https://app.brevo.com/settings/senders)
2. Click **Add a new sender**
3. Enter your sender email and name
4. Verify the email by clicking the link sent to your inbox
5. **Important**: Only verified emails can be used as senders

### 4. Configure Environment Variables

Update your `.env` file with the following variables:

```env
# Brevo API Key (required)
BREVO_API_KEY=xkeysib-your_actual_api_key_here

# Brevo Sender Email (must be verified in Brevo)
BREVO_SENDER_EMAIL=noreply@yourdomain.com

# Application URL (for unsubscribe/preference links)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Important Notes:**
- Replace `your_actual_api_key_here` with your actual Brevo API key
- Replace `noreply@yourdomain.com` with your verified sender email
- For production, update `NEXT_PUBLIC_APP_URL` to your actual domain

### 5. Verify Installation

The Brevo SDK is already installed in `package.json`:

```json
"@getbrevo/brevo": "^3.0.1"
```

If you need to reinstall dependencies:

```bash
npm install
```

## Architecture

### Service Layer

**Location**: `features/email_list/services/BrevoService.ts`

The BrevoService provides these functions:

- `sendTransactionalEmail()` - Send a single email to up to 50 recipients
- `sendCampaignEmails()` - Send campaign emails with automatic batching
- `validateBrevoApiKey()` - Check if API key is valid
- `getBrevoAccountInfo()` - Get account details and usage info

### Campaign Sending Flow

**Location**: `features/email_list/actions/sendCampaign.ts`

1. Fetches campaign details from database
2. Validates campaign status (must be Draft)
3. Gets campaign creator's profile information
4. Queries subscribers based on recipient filters
5. Generates HTML email template with author info
6. Updates campaign status to "Sending"
7. Calls `sendCampaignEmails()` to send via Brevo
8. Updates campaign status to "Sent" or "Failed"

### Email Template

**Location**: `features/email_list/utils/emailTemplate.ts`

The email template includes:
- Responsive HTML design
- Campaign subject as header
- Rich content from TipTap editor
- Author profile section (name, company, experience)
- Professional footer with unsubscribe/preference links
- Mobile-responsive styles

## Usage

### Sending a Campaign

1. Navigate to **Email List** → **Campaigns**
2. Create a new campaign or edit a draft
3. Fill in:
   - Campaign name
   - Email subject
   - Email content (using rich text editor)
   - Recipient filters (status, source, tags)
4. Save as draft
5. Click **Send** to deliver the campaign
6. Monitor status changes: Draft → Sending → Sent/Failed

### Recipient Filtering

Filter subscribers by:
- **Status**: Active, Inactive, Pending
- **Source**: Website, Manual, Import, API
- **Tags**: Custom tags for segmentation

### Viewing Campaign Results

After sending, view:
- Total recipients
- Sent count
- Open rate (requires Brevo webhook setup)
- Click rate (requires Brevo webhook setup)
- Bounce count
- Unsubscribe count

## API Limits

### Free Tier (Brevo)
- 300 emails/day
- 50 recipients per transactional email
- Rate limiting recommended

### Paid Tiers
- Higher daily limits based on plan
- Same 50 recipients per transactional email
- Premium features available

## Rate Limiting

The integration includes built-in rate limiting:
- Batches of 50 recipients
- 1 second delay between batches
- Prevents API rate limit errors

## Error Handling

The service handles common errors:
- Invalid API key
- Unverified sender email
- Rate limit exceeded
- Network failures
- Invalid recipient emails

Failed campaigns are marked with status "Failed" and error details are logged.

## Testing

### Test API Key

```typescript
import { validateBrevoApiKey } from '@/features/email_list/services/BrevoService';

const isValid = await validateBrevoApiKey();
console.log('API Key valid:', isValid);
```

### Send Test Email

Create a test campaign with:
- A single test subscriber
- Simple content
- Your email as recipient

## Database Schema

### Campaigns Table

```sql
campaigns (
  id: uuid
  name: text
  subject: text
  content: text (HTML from TipTap)
  status: text (Draft|Scheduled|Sending|Sent|Failed)
  created_by: uuid (references profiles)
  created_at: timestamp
  updated_at: timestamp
  sent_date: timestamp
  scheduled_date: timestamp
  recipient_filters: jsonb
  total_recipients: integer
  sent_count: integer
  open_count: integer
  click_count: integer
  bounce_count: integer
  unsubscribe_count: integer
  tags: text[]
)
```

### Subscribers Table

```sql
subscribers (
  id: uuid
  name: text
  email: text
  status: text (Active|Inactive|Pending)
  source: text (Website|Manual|Import|API)
  subscription_date: timestamp
  last_activity: timestamp
  tags: text[]
  created_at: timestamp
  updated_at: timestamp
)
```

## Advanced Features

### Webhook Integration (Optional)

To track opens and clicks, set up Brevo webhooks:

1. Go to **Settings** → **Webhooks** in Brevo
2. Create webhook endpoint: `https://yourdomain.com/api/brevo/webhook`
3. Subscribe to events: `opened`, `click`, `bounce`, `unsubscribe`
4. Implement webhook handler to update campaign stats

### Unsubscribe Page

Implement unsubscribe functionality:
- Create page at `/unsubscribe/[email]`
- Update subscriber status to "Inactive"
- Show confirmation message

### Preference Center

Implement preference management:
- Create page at `/preferences/[email]`
- Allow subscribers to update tags/interests
- Update subscriber record

## Troubleshooting

### API Key Not Working
- Verify key is copied correctly
- Check if key is active in Brevo dashboard
- Ensure no extra spaces in `.env`

### Sender Email Rejected
- Verify email in Brevo dashboard
- Check spam folder for verification email
- Use exact verified email in `BREVO_SENDER_EMAIL`

### Emails Not Sending
- Check campaign status in database
- Review server logs for errors
- Verify subscriber email addresses are valid
- Ensure API limits not exceeded

### Rate Limit Errors
- Reduce batch size in `BrevoService.ts`
- Increase delay between batches
- Upgrade Brevo plan for higher limits

## Security Best Practices

1. **Never commit API keys** - Use `.env` and `.env.example`
2. **Validate subscriber emails** - Prevent spam and bounces
3. **Implement unsubscribe** - Required by law (CAN-SPAM, GDPR)
4. **Secure webhook endpoint** - Verify Brevo signature
5. **Rate limit user actions** - Prevent abuse

## Support

- **Brevo Documentation**: [https://developers.brevo.com](https://developers.brevo.com)
- **Brevo Support**: [https://help.brevo.com](https://help.brevo.com)
- **SDK Repository**: [https://github.com/getbrevo/brevo-node](https://github.com/getbrevo/brevo-node)

## Migration Notes

If migrating from another email service:
1. Export subscribers from old service
2. Import to Supabase `subscribers` table
3. Update sender email verification in Brevo
4. Test with small campaign first
5. Monitor deliverability rates

## Next Steps

1. Set up Brevo account
2. Configure environment variables
3. Verify sender email
4. Create test campaign
5. Send to test subscriber list
6. Monitor results and adjust as needed
7. Implement webhooks for advanced tracking (optional)
8. Create unsubscribe and preference pages

## Additional Resources

- Brevo Pricing: [https://www.brevo.com/pricing](https://www.brevo.com/pricing)
- Email Best Practices: [https://www.brevo.com/blog/email-best-practices](https://www.brevo.com/blog/email-best-practices)
- GDPR Compliance: [https://www.brevo.com/legal/gdpr](https://www.brevo.com/legal/gdpr)
