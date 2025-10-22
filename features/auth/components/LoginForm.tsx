'use client';

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginSchema } from "../validations/authValidations";
import { AUTH_CONFIG } from "../config";
import type { LoginFormData } from "../types";
import { staggerContainer, fadeInUp, animationPresets } from "@/lib/animations";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: AUTH_CONFIG.defaultValues.login,
    mode: "onChange"
  });

  const watchedRole = watch("role");

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

      <Tabs defaultValue="credentials" className="w-full">
        <TabsContent value="credentials">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeInUp}>
                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <RadioGroup
                    value={watchedRole}
                    className="flex gap-4"
                    onValueChange={(value) => setValue("role", value as "patient" | "therapist", { shouldValidate: true })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="patient" id="patient" />
                      <Label htmlFor="patient">Patient</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="therapist" id="therapist" />
                      <Label htmlFor="therapist">Therapist</Label>
                    </div>
                  </RadioGroup>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role.message}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={errors.password ? "border-destructive focus-visible:ring-destructive pr-10" : "pr-10"}
                      {...register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Button
                  type="submit"
                  className="w-full bg-primary text-white"
                  disabled={loading || !isValid}
                >
                  {loading ? "Logging in..." : "Log in"}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </TabsContent>
      </Tabs>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account?</span>{" "}
        <Link href="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </>
  );
};
