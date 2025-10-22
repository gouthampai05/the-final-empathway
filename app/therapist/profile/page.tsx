'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Phone, Building, Calendar, Award, FileText, Settings, LogOut, Home } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TherapistProfile {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  company_name: string;
  role: string;
  profile_pic_url: string | null;
}

interface TherapistDetails {
  id: string;
  years_experience: number;
  expertise: string[];
  bio: string | null;
}

export default function TherapistProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<TherapistProfile | null>(null);
  const [therapistDetails, setTherapistDetails] = useState<TherapistDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push('/login');
          return;
        }

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw new Error('Failed to fetch profile');
        }

        setProfile(profileData);

        // Fetch therapist details
        const { data: therapistData, error: therapistError } = await supabase
          .from('therapists')
          .select('*')
          .eq('id', user.id)
          .single();

        if (therapistError) {
          throw new Error('Failed to fetch therapist details');
        }

        setTherapistDetails(therapistData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleCompleteProfile = () => {
    router.push('/therapist/complete-profile');
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isProfileComplete = profile?.name && profile?.phone_number && profile?.company_name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Profile Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="sticky top-8 space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={handleGoHome}>
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleCompleteProfile}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="destructive" className="w-full justify-start" onClick={() => setConfirmLogoutOpen(true)}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        <div className="flex-1">
        {/* Profile Completion Alert */}
        {!isProfileComplete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="border-amber-200 bg-amber-50">
              <AlertDescription className="flex items-center justify-between">
                <span>Please complete your profile to access all features.</span>
                <Button size="sm" onClick={handleCompleteProfile}>
                  Complete Profile
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Profile
          </h2>
          <p className="text-gray-600">
            View and manage your professional information.
          </p>
        </motion.div>

        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isProfileComplete ? 'Complete' : 'Incomplete'}
              </div>
              <p className="text-xs text-muted-foreground">
                {isProfileComplete ? 'All details filled' : 'Missing required information'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Experience</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {therapistDetails?.years_experience || 0} years
              </div>
              <p className="text-xs text-muted-foreground">
                Professional experience
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Areas of Expertise</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {therapistDetails?.expertise?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Specializations
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.name || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.phone_number || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.company_name || 'Not provided'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>Your therapy practice information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Years of Experience</p>
                  <p className="text-sm text-muted-foreground">
                    {therapistDetails?.years_experience || 0} years
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Areas of Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {therapistDetails?.expertise?.length ? (
                    therapistDetails.expertise.map((area, index) => (
                      <Badge key={index} variant="secondary">
                        {area}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No specializations added</p>
                  )}
                </div>
              </div>
              {therapistDetails?.bio && (
                <div>
                  <p className="text-sm font-medium mb-2">Bio</p>
                  <p className="text-sm text-muted-foreground">
                    {therapistDetails.bio}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </div>

      {/* Logout Confirmation */}
      <AlertDialog open={confirmLogoutOpen} onOpenChange={setConfirmLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


