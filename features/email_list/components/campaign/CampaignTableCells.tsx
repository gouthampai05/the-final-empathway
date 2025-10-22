import { Badge } from '@/components/ui/badge';
import type { Campaign } from '../../types/Campaign';

export const CampaignStatusBadge = ({ status }: { status: Campaign['status'] }) => (
  <Badge 
    variant={
      status === 'Sent' ? 'default' : 
      status === 'Draft' ? 'secondary' :
      status === 'Scheduled' ? 'outline' :
      status === 'Failed' ? 'destructive' : 'secondary'
    }
  >
    {status}
  </Badge>
);

export const CampaignOpenRate = ({ campaign }: { campaign: Campaign }) => (
  <span>
    {campaign.sentCount > 0 
      ? `${((campaign.openCount / campaign.sentCount) * 100).toFixed(1)}%`
      : '-'
    }
  </span>
);

export const CampaignTags = ({ tags }: { tags: Campaign['tags'] }) => (
  <div className="flex gap-1 flex-wrap">
    {tags.slice(0, 2).map(tag => (
      <Badge key={tag} variant="secondary" className="text-xs">
        {tag}
      </Badge>
    ))}
    {tags.length > 2 && (
      <Badge variant="secondary" className="text-xs">
        +{tags.length - 2}
      </Badge>
    )}
  </div>
);
