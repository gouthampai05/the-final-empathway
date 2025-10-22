'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { TherapistProfile, TherapistDetails } from '../actions';
import { updateTherapistProfile, updateTherapistDetails } from '../actions';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 characters'),
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  years_experience: z.number().min(0, 'Years must be positive'),
  bio: z.string().optional(),
  expertise: z.array(z.string()).min(1, 'Add at least one area of expertise'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: TherapistProfile | null;
  therapistDetails: TherapistDetails | null;
  onSuccess: () => void;
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  profile,
  therapistDetails,
  onSuccess,
}: ProfileEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState('');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profile?.name || '',
      phone_number: profile?.phone_number || '',
      company_name: profile?.company_name || '',
      years_experience: therapistDetails?.years_experience || 0,
      bio: therapistDetails?.bio || '',
      expertise: therapistDetails?.expertise || [],
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Updating profile...');

    try {
      // Update profile data
      await updateTherapistProfile({
        name: data.name,
        phone_number: data.phone_number,
        company_name: data.company_name,
      });

      // Update therapist details
      await updateTherapistDetails({
        years_experience: data.years_experience,
        bio: data.bio,
        expertise: data.expertise,
      });

      toast.success('Profile updated successfully', { id: toastId });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update profile', {
        id: toastId,
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddExpertise = () => {
    if (expertiseInput.trim()) {
      const currentExpertise = form.getValues('expertise');
      if (!currentExpertise.includes(expertiseInput.trim())) {
        form.setValue('expertise', [...currentExpertise, expertiseInput.trim()]);
        setExpertiseInput('');
      }
    }
  };

  const handleRemoveExpertise = (expertise: string) => {
    const currentExpertise = form.getValues('expertise');
    form.setValue(
      'expertise',
      currentExpertise.filter(e => e !== expertise)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddExpertise();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your professional information and expertise
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Therapy Associates" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="years_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="5"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Areas of Expertise</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add expertise (e.g., CBT, Anxiety)"
                        value={expertiseInput}
                        onChange={e => setExpertiseInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddExpertise}
                      >
                        Add
                      </Button>
                    </div>
                    {field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((expertise, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {expertise}
                            <button
                              type="button"
                              onClick={() => handleRemoveExpertise(expertise)}
                              className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself and your practice..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
