'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/templates/AuthLayout";
import { Check, ChevronsUpDown, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { mapAuthErrorMessage } from "@/lib/authErrorMessages";
import { completeTherapistProfile } from "../services/authService";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getCroppedImageDataUrl } from "@/lib/cropImage";

const expertiseOptions = [
  { label: "Anxiety", value: "anxiety" },
  { label: "Depression", value: "depression" },
  { label: "Work Stress", value: "work-stress" },
  { label: "PTSD", value: "ptsd" },
  { label: "Addiction", value: "addiction" },
  { label: "Grief", value: "grief" },
  { label: "Relationship Issues", value: "relationship-issues" },
  { label: "Trauma", value: "trauma" },
  { label: "Self-Esteem", value: "self-esteem" },
  { label: "Anger Management", value: "anger-management" },
];

export default function CompleteTherapistProfile() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [croppingImageUrl, setCroppingImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<{ width: number; height: number; x: number; y: number } | null>(null);
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
  const [licenseImageName, setLicenseImageName] = useState<string | null>(null);
  
  const { loading, error, submitForm } = useFormSubmission(mapAuthErrorMessage);
  
  const [formData, setFormData] = useState({
    phoneNumber: "",
    companyName: "",
    name: "",
    yearsExperience: "",
    expertise: [] as string[],
    bio: "",
  });

  // Preload any pending data from localStorage (for unauthenticated users after registration)
  useEffect(() => {
    try {
      const pending = localStorage.getItem("pendingTherapistDetails");
      if (pending) {
        const parsed = JSON.parse(pending);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          expertise: Array.isArray(parsed?.expertise) ? parsed.expertise : prev.expertise,
        }));
        if (parsed?.profilePic) {
          setProfileImagePreview(parsed.profilePic);
        }
      }
    } catch {}
  }, []);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      const objectUrl = URL.createObjectURL(file);
      setCroppingImageUrl(objectUrl);
      setIsCropOpen(true);
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const closeCropper = useCallback(() => {
    if (croppingImageUrl) {
      try { URL.revokeObjectURL(croppingImageUrl); } catch {}
    }
    setIsCropOpen(false);
    setCroppingImageUrl(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
  }, [croppingImageUrl]);

  const confirmCrop = useCallback(async () => {
    if (!croppingImageUrl || !croppedArea) return;
    try {
      const dataUrl = await getCroppedImageDataUrl(croppingImageUrl, croppedArea, true, 'image/png', 0.92);
      setProfileImagePreview(dataUrl);
    } finally {
      closeCropper();
    }
  }, [croppingImageUrl, croppedArea, closeCropper]);

  const handleLicenseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLicenseImage(file);
      setLicenseImageName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await submitForm(async () => {
      const profilePicUrl = profileImagePreview || "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70);
      
      // Try to complete profile via API; if unauthenticated, save to localStorage and send to login
      try {
        const result = await completeTherapistProfile({
          ...formData,
          profilePic: profilePicUrl,
        });
        if (result.success) {
          try { localStorage.removeItem("pendingTherapistDetails"); } catch {}
          router.push("/");
          return;
        }
      } catch (err) {
        // If not authenticated, persist details and redirect to login
        try {
          localStorage.setItem("pendingTherapistDetails", JSON.stringify({ ...formData, profilePic: profilePicUrl }));
        } catch {}
        router.push("/login");
      }
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AuthLayout 
      title="Complete Your Profile" 
      description="Tell us more about yourself as a mental health professional"
      maxWidth="md:max-w-4xl"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <motion.div 
          className="space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Personal Information Section */}
          <motion.div variants={item} className="space-y-6">
            <div className="pb-2 border-b">
              <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
              <p className="text-sm text-muted-foreground mt-1">Basic details about yourself</p>
            </div>
            
            {/* Profile Picture - Full Width */}
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-card">
                <div className="flex-shrink-0">
                  {profileImagePreview ? (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border">
                      <Image
                        src={profileImagePreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                        width={80}
                        height={80}
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label 
                    htmlFor="profilePic"
                    className="cursor-pointer"
                  >
                    <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                      <Upload className="h-4 w-4 mr-2" />
                      {profileImage ? 'Change Photo' : 'Upload Photo'}
                    </div>
                  </label>
                  <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                  <input 
                    id="profilePic" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Crop Dialog */}
            <Dialog open={isCropOpen} onOpenChange={(open) => { if (!open) closeCropper(); }}>
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle>Crop Profile Photo</DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-[320px] bg-muted rounded-md overflow-hidden">
                  {croppingImageUrl && (
                    <Cropper
                      image={croppingImageUrl}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="zoom" className="text-xs text-muted-foreground">Zoom</Label>
                  <input
                    id="zoom"
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={closeCropper}>Cancel</Button>
                  <Button type="button" onClick={confirmCrop}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Name and Phone - 2 columns on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Legal Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Dr. Jane Smith"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+44 123 456 7890"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Company Name - Full Width */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Practice or Clinic Name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Your clinic or practice name"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
              />
            </div>
          </motion.div>

          {/* Professional Details Section */}
          <motion.div variants={item} className="space-y-6">
            <div className="pb-2 border-b">
              <h3 className="text-xl font-semibold text-foreground">Professional Details</h3>
              <p className="text-sm text-muted-foreground mt-1">Your experience and expertise</p>
            </div>
            
            {/* Experience and Expertise - 2 columns on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  placeholder="5"
                  value={formData.yearsExperience}
                  onChange={(e) => handleInputChange("yearsExperience", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Areas of Expertise</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {formData.expertise.length > 0
                        ? `${formData.expertise.length} area${formData.expertise.length > 1 ? 's' : ''} selected`
                        : "Select expertise areas"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search expertise..." />
                      <CommandEmpty>No expertise found.</CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-auto">
                        {expertiseOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              const updatedExpertise = formData.expertise.includes(option.label)
                                ? formData.expertise.filter((item) => item !== option.label)
                                : [...formData.expertise, option.label];
                              
                              handleInputChange("expertise", updatedExpertise);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.expertise.includes(option.label) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formData.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.expertise.map((item) => (
                      <span 
                        key={item} 
                        className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bio - Full Width */}
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background, approach to therapy, and what makes you unique as a mental health professional..."
                className="min-h-[120px] resize-y"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">This will be shown to potential clients</p>
            </div>

            {/* License Certificate */}
            <div className="space-y-2">
              <Label>Professional License Certificate</Label>
              <div className="p-4 border rounded-lg bg-card space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label 
                    htmlFor="license"
                    className="cursor-pointer"
                  >
                    <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                      <Upload className="h-4 w-4 mr-2" />
                      {licenseImageName ? 'Change File' : 'Upload License'}
                    </div>
                  </label>
                  <div className="flex-1">
                    {licenseImageName ? (
                      <p className="text-sm font-medium text-foreground">{licenseImageName}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No file selected</p>
                    )}
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </div>
                <input 
                  id="license" 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleLicenseImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={item} className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto sm:min-w-[200px] bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Saving Profile..." : "Complete Profile"}
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </AuthLayout>
  );
}
