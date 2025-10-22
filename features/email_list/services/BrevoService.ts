/**
 * Brevo (formerly Sendinblue) Email Service
 *
 * This service handles all email campaign operations through the Brevo API.
 * Requires BREVO_API_KEY environment variable to be set.
 */

import * as brevo from '@getbrevo/brevo';

// Get API key from environment
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';

// Helper function to create authenticated API instance
function createTransactionalEmailsApi() {
  const apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);
  return apiInstance;
}

export interface EmailRecipient {
  email: string;
  name: string;
}

export interface SendEmailParams {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  sender: {
    name: string;
    email: string;
  };
  replyTo?: {
    name: string;
    email: string;
  };
}

export interface CampaignEmailData {
  campaignId: string;
  campaignName: string;
  subject: string;
  htmlContent: string;
  recipients: EmailRecipient[];
  senderName: string;
  senderEmail: string;
}

/**
 * Send a transactional email via Brevo
 */
export async function sendTransactionalEmail(params: SendEmailParams) {
  try {
    const apiInstance = createTransactionalEmailsApi();
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.to = params.to.map(recipient => ({
      email: recipient.email,
      name: recipient.name,
    }));

    sendSmtpEmail.sender = {
      name: params.sender.name,
      email: params.sender.email,
    };

    if (params.replyTo) {
      sendSmtpEmail.replyTo = {
        name: params.replyTo.name,
        email: params.replyTo.email,
      };
    }

    sendSmtpEmail.subject = params.subject;
    sendSmtpEmail.htmlContent = params.htmlContent;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    return {
      success: true,
      messageId: response.body?.messageId,
      data: response.body,
    };
  } catch (error) {
    console.error('Brevo send email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send campaign emails to multiple recipients
 * This batches emails if needed to avoid rate limits
 */
export async function sendCampaignEmails(data: CampaignEmailData) {
  console.log('[BrevoService] sendCampaignEmails called with', data.recipients.length, 'recipients');
  console.log('[BrevoService] BREVO_API_KEY configured:', BREVO_API_KEY ? 'Yes' : 'No');

  const BATCH_SIZE = 50; // Brevo allows up to 50 recipients per transactional email
  const results: Array<{ success: boolean; batch: number; error?: string }> = [];

  // Split recipients into batches
  for (let i = 0; i < data.recipients.length; i += BATCH_SIZE) {
    const batch = data.recipients.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

    console.log(`[BrevoService] Sending batch ${batchNumber} with ${batch.length} recipients`);

    try {
      const result = await sendTransactionalEmail({
        to: batch,
        subject: data.subject,
        htmlContent: data.htmlContent,
        sender: {
          name: data.senderName,
          email: data.senderEmail,
        },
        replyTo: {
          name: data.senderName,
          email: data.senderEmail,
        },
      });

      console.log(`[BrevoService] Batch ${batchNumber} result:`, result);

      results.push({
        success: result.success,
        batch: batchNumber,
        error: result.error,
      });

      // Add delay between batches to respect rate limits
      if (i + BATCH_SIZE < data.recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    } catch (error) {
      console.error(`[BrevoService] Batch ${batchNumber} failed:`, error);
      results.push({
        success: false,
        batch: batchNumber,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  const successCount = results.filter(r => r.success).length;
  const totalBatches = results.length;

  console.log('[BrevoService] Campaign send complete:', { successCount, totalBatches });

  return {
    success: successCount === totalBatches,
    totalRecipients: data.recipients.length,
    totalBatches,
    successfulBatches: successCount,
    failedBatches: totalBatches - successCount,
    results,
  };
}

// Helper function to create authenticated Account API instance
function createAccountApi() {
  const apiInstance = new brevo.AccountApi();
  apiInstance.setApiKey(brevo.AccountApiApiKeys.apiKey, BREVO_API_KEY);
  return apiInstance;
}

/**
 * Validate Brevo API key
 */
export async function validateBrevoApiKey(): Promise<boolean> {
  try {
    // Try to get account info to validate the API key
    const accountApi = createAccountApi();
    await accountApi.getAccount();
    return true;
  } catch (error) {
    console.error('Brevo API key validation failed:', error);
    return false;
  }
}

/**
 * Get account information
 */
export async function getBrevoAccountInfo() {
  try {
    const accountApi = createAccountApi();
    const account = await accountApi.getAccount();
    return {
      success: true,
      data: account,
    };
  } catch (error) {
    console.error('Failed to get Brevo account info:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get account info',
    };
  }
}
