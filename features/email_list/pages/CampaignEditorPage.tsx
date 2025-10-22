'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  Eye,
  EyeOff,
  Save,
  Mail,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmailEditor } from '../components/EmailEditor';
import { generatePreviewTemplate } from '../utils/emailTemplate';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { createCampaign, updateCampaign, sendCampaign } from '../actions';
import { Campaign, CampaignFormData } from '../types/Campaign';

interface CampaignEditorPageProps {
  campaign?: Campaign;
  isEdit?: boolean;
}

export const CampaignEditorPage: React.FC<CampaignEditorPageProps> = ({
  campaign,
  isEdit = false,
}) => {
  const router = useRouter();
  const { submitForm, loading } = useFormSubmission();
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Form state
  const [formData, setFormData] = useState<CampaignFormData>({
    name: campaign?.name || '',
    subject: campaign?.subject || '',
    content: campaign?.content || '',
    scheduledDate: campaign?.scheduledDate || undefined,
    templateId: campaign?.templateId || undefined,
    recipientFilters: campaign?.recipientFilters || {
      statuses: [],
      sources: [],
      tags: [],
    },
    tags: campaign?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');

  // Update preview when content changes
  useEffect(() => {
    if (formData.content) {
      const preview = generatePreviewTemplate({
        subject: formData.subject || 'Email Preview',
        content: formData.content,
        authorName: 'Dr. Jane Smith', // TODO: Get from user profile
        authorCompany: 'EmpathWay Psychology Practice',
        authorYearsExperience: 10,
      });
      setPreviewHtml(preview);
    }
  }, [formData.content, formData.subject]);

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveStatus('unsaved');
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    setSaveStatus('unsaved');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
      setSaveStatus('unsaved');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    setSaveStatus('unsaved');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async (isDraft = true) => {
    if (!formData.name || !formData.subject || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaveStatus('saving');
    const toastId = toast.loading(isEdit ? 'Updating campaign...' : 'Creating campaign...');

    try {
      await submitForm(async () => {
        if (isEdit && campaign) {
          await updateCampaign(campaign.id, formData);
        } else {
          await createCampaign(formData);
        }
      });

      toast.success(isEdit ? 'Campaign updated successfully' : 'Campaign created successfully', {
        id: toastId,
      });

      setSaveStatus('saved');
      setLastSaved(new Date());

      // Redirect to campaigns list
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (error) {
      setSaveStatus('unsaved');
      toast.error(isEdit ? 'Failed to update campaign' : 'Failed to create campaign', {
        id: toastId,
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const handleSend = async () => {
    if (!formData.name || !formData.subject || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!campaign?.id && !isEdit) {
      toast.error('Please save the campaign first before sending');
      return;
    }

    const toastId = toast.loading('Sending campaign...');

    try {
      await submitForm(async () => {
        const campaignId = campaign?.id || '';
        await sendCampaign(campaignId);
      });

      toast.success('Campaign sent successfully!', {
        id: toastId,
        description: 'Your email has been sent to all subscribers',
      });

      router.back();
    } catch (error) {
      toast.error('Failed to send campaign', {
        id: toastId,
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">
                {isEdit ? 'Edit Campaign' : 'New Campaign'}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {saveStatus === 'saving' && (
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Saving...</span>
                  </div>
                )}
                {saveStatus === 'saved' && lastSaved && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
                {saveStatus === 'unsaved' && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-orange-600" />
                    <span>Unsaved changes</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPreview ? 'Edit' : 'Preview'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSave(true)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </DropdownMenuItem>
                {isEdit && campaign?.status === 'Draft' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSend}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Campaign
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => handleSave(true)}
              disabled={loading || !formData.name.trim() || !formData.content.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Campaign
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-4 py-6 lg:px-6">
          {/* Subject Input */}
          <div className="mb-8">
            <Input
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Email subject line..."
              className="text-4xl font-bold border-0 shadow-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground"
            />
          </div>

          {/* Editor / Preview */}
          <div className="space-y-6">
            {showPreview ? (
              <div className="border rounded-lg p-4 bg-muted/30 max-h-[600px] overflow-auto">
                {previewHtml ? (
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-[800px] border-0 bg-white rounded"
                    title="Email Preview"
                    sandbox="allow-same-origin"
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start writing to see a preview</p>
                  </div>
                )}
              </div>
            ) : (
              <EmailEditor
                initialContent={formData.content}
                onChange={handleContentChange}
                placeholder="Write your email content here... Use / for commands"
              />
            )}
          </div>
        </main>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-full lg:w-80 border-l-0 lg:border-l border-t lg:border-t-0 bg-muted/30 p-4 lg:p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Settings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                {/* Campaign Name */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Campaign Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Summer Newsletter 2024"
                    />
                  </CardContent>
                </Card>

                {/* Scheduled Date */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="datetime-local"
                      value={formData.scheduledDate || ''}
                      onChange={(e) => handleInputChange('scheduledDate', e.target.value || undefined)}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Leave empty to send immediately
                    </p>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Add a tag..."
                        className="flex-1"
                      />
                      <Button onClick={handleAddTag} size="sm">
                        Add
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer hover:bg-secondary/80"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info" className="space-y-4">
                {/* Campaign Info */}
                {campaign && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Campaign Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge>{campaign.status}</Badge>
                      </div>
                      {campaign.sentDate && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Sent Date</span>
                          </div>
                          <span className="font-medium">
                            {new Date(campaign.sentDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {campaign.status === 'Sent' && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Recipients</span>
                            <span className="font-medium">{campaign.recipientCount}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Open Rate</span>
                            <span className="font-medium">{campaign.openRate}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Click Rate</span>
                            <span className="font-medium">{campaign.clickRate}%</span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Help Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Email Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Use a clear, compelling subject line</p>
                    <p>• Keep your content concise and scannable</p>
                    <p>• Include a clear call-to-action</p>
                    <p>• Preview before sending</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </aside>
        )}

        {/* Sidebar Toggle */}
        {!sidebarOpen && (
          <Button
            variant="outline"
            size="sm"
            className="fixed right-4 top-20 z-30"
            onClick={() => setSidebarOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
