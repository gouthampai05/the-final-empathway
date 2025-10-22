'use server';

import { createClient } from '@/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  getCampaignData,
  getFilteredSubscribers,
  updateCampaignStatus,
} from '../services/CampaignSendService';
import { sendCampaignEmails } from '../services/BrevoService';
import { generateEmailTemplate } from '../utils/emailTemplate';

/**
 * Send a campaign to subscribers via Brevo
 *
 * Refactored to use CampaignSendService for better separation of concerns.
 * This action now focuses on orchestrating the send flow while the service
 * handles the complex data fetching and business logic.
 *
 * @param campaignId - Campaign ID to send
 * @returns Success result with recipient count
 * @throws Error if campaign cannot be sent
 */
export async function sendCampaign(campaignId: string) {
  const supabase = await createClient();

  try {
    console.log('[sendCampaign] Starting campaign send:', campaignId);

    // 1. Get campaign and profile data
    const { campaign, profile, therapist } = await getCampaignData(supabase, campaignId);
    console.log('[sendCampaign] Campaign data loaded:', { campaignId: campaign.id, status: campaign.status });

    // 2. Get filtered subscribers
    const subscribers = await getFilteredSubscribers(supabase, campaign.recipient_filters, campaign.user_id);
    console.log('[sendCampaign] Subscribers fetched:', subscribers.length);

    // 3. Generate email HTML template
    const emailHtml = generateEmailTemplate({
      subject: campaign.subject,
      content: campaign.content,
      authorName: profile.name || 'Unknown',
      authorCompany: profile.company_name,
      authorYearsExperience: therapist?.years_experience,
      unsubscribeLink: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe/{EMAIL}`,
      preferencesLink: `${process.env.NEXT_PUBLIC_APP_URL}/preferences/{EMAIL}`,
    });

    // 4. Update status to Sending
    console.log('[sendCampaign] Updating status to Sending');
    await updateCampaignStatus(supabase, campaignId, 'Sending');

    // 5. Send emails via Brevo
    console.log('[sendCampaign] Sending emails via Brevo to', subscribers.length, 'recipients');
    const result = await sendCampaignEmails({
      campaignId,
      campaignName: campaign.name,
      subject: campaign.subject,
      htmlContent: emailHtml,
      recipients: subscribers.map(sub => ({
        email: sub.email,
        name: sub.name,
      })),
      senderName: profile.name || 'EmpathWay',
      senderEmail: profile.email || process.env.BREVO_SENDER_EMAIL || 'noreply@empathway.com',
    });

    console.log('[sendCampaign] Brevo result:', result);

    // 6. Update campaign with final status and results
    const finalStatus = result.success ? 'Sent' : 'Failed';
    console.log('[sendCampaign] Updating status to', finalStatus);
    await updateCampaignStatus(supabase, campaignId, finalStatus, {
      sent_date: new Date().toISOString(),
      total_recipients: result.totalRecipients,
      sent_count: result.successfulBatches * 50, // Approximate, update with actual count
    });
    console.log('[sendCampaign] Status updated successfully');

    // Revalidate both the campaign list and the specific campaign edit page
    revalidatePath('/email_list/campaign');
    revalidatePath(`/email_list/campaign/edit/${campaignId}`);

    if (!result.success) {
      throw new Error(`Campaign partially sent. ${result.failedBatches} batches failed.`);
    }

    return {
      success: true,
      message: 'Campaign sent successfully',
      recipientCount: result.totalRecipients,
    };
  } catch (error) {
    console.error('Send campaign error:', error);

    // Update campaign status to Failed
    await updateCampaignStatus(supabase, campaignId, 'Failed');

    throw error;
  }
}
