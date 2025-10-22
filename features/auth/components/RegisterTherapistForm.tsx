'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { staggerContainer, fadeInUp, animationPresets } from "@/lib/animations";

interface RegisterTherapistFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const RegisterTherapistForm: React.FC<RegisterTherapistFormProps> = ({ onSubmit, loading, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      throw new Error("Passwords don't match");
    }

    await onSubmit({
      email: formData.email,
      password: formData.password,
    });
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordMismatch = formData.password && formData.confirmPassword && !passwordsMatch;

  return (
    <>
      {error && (
        <motion.div
          variants={animationPresets.alert}
          initial="hidden"
          animate="show"
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
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeInUp}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
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

          <motion.div variants={fadeInUp}>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </motion.div>

          {showPasswordMismatch && (
            <motion.div variants={fadeInUp}>
              <Alert className="bg-destructive/10 text-destructive border-destructive/20">
                <AlertDescription>Passwords don't match</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.div variants={fadeInUp}>
            <Button
              type="submit"
              className="w-full bg-primary"
              disabled={loading || !passwordsMatch}
            >
              {loading ? "Creating Account..." : "Create Account"}
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
