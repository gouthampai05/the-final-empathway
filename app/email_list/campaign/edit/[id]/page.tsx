'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CampaignEditorPage } from '@/features/email_list';
import { Campaign } from '@/features/email_list/types/Campaign';
import { EditorLoader } from '@/components/shared';
import { getCampaigns } from '@/features/email_list';

export default function EditCampaignPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaign() {
      try {
        const campaigns = await getCampaigns();
        const found = campaigns.find(c => c.id === campaignId);
        setCampaign(found || null);
      } catch (error) {
        console.error('Failed to load campaign:', error);
      } finally {
        setLoading(false);
      }
    }

    if (campaignId) {
      loadCampaign();
    }
  }, [campaignId]);

  if (loading) {
    return <EditorLoader />;
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Campaign not found</h3>
        <p className="text-muted-foreground">The campaign you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  return <CampaignEditorPage campaign={campaign} isEdit />;
}
