'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import type { PatientRegistrationData } from "../types";

interface RegisterPatientFormProps {
  onSubmit: (data: PatientRegistrationData & { profilePic: string }) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const RegisterPatientForm: React.FC<RegisterPatientFormProps> = ({ onSubmit, loading, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<PatientRegistrationData>({
    email: "",
    password: "",
    phoneNumber: "",
    companyName: "",
    name: "",
  });

  const handleInputChange = (field: keyof PatientRegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const profilePicUrl = profileImagePreview || "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70);

    await onSubmit({
      ...formData,
      profilePic: profilePicUrl,
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
    <>
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

      <form onSubmit={handleSubmit}>
        <motion.div
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="text-left text-lg font-medium mb-2">
            Personal Information
          </motion.div>

          <motion.div variants={item}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+44 123 456 7890"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company name</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Your construction company"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="space-y-2">
              <Label htmlFor="name">Legal name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="space-y-2">
              <Label>Profile pic</Label>
              <div className="flex items-center gap-4">
                {profileImagePreview && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      width={64}
                      height={64}
                    />
                  </div>
                )}
                <label
                  htmlFor="profilePic"
                  className="cursor-pointer flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                >
                  <div className="flex h-9 items-center justify-center rounded-md border border-input bg-background px-3">
                    <Upload className="h-4 w-4 mr-2" />
                    {profileImage ? profileImage.name : "Choose file"}
                  </div>
                </label>
                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Button
              type="submit"
              className="w-full bg-primary"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </motion.div>
        </motion.div>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login here
        </Link>
      </div>
    </>
  );
};
