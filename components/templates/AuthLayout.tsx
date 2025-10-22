'use client';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { animationPresets } from "@/lib/animations";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function AuthLayout({
  children,
  title,
  description,
  footer,
  maxWidth = "md:max-w-md",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <motion.div
        variants={animationPresets.page}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        <Link 
          href="/"
          className="mx-auto block w-full max-w-[200px] mb-8 text-center"
        >
          <h1 className="gradient-text text-2xl font-bold">Empathway</h1>
          <p className="text-muted-foreground text-sm">Your Way to Well-Being</p>
        </Link>
        
        <Card className={`mx-auto w-full ${maxWidth} glass-card`}>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl text-center">{title}</CardTitle>
            {description && (
              <CardDescription className="text-center">{description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>{children}</CardContent>
          {footer && <CardFooter>{footer}</CardFooter>}
        </Card>
      </motion.div>
    </div>
  );
}
