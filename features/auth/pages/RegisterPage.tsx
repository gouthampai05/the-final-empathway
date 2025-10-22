'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/templates/AuthLayout";
import { motion } from "framer-motion";
import { staggerContainerFast, fadeInUp } from "@/lib/animations";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an account"
      description="Choose your account type to get started"
      maxWidth="md:max-w-lg"
    >
      <motion.div
        variants={staggerContainerFast}
        initial="hidden"
        animate="show"
        className="grid gap-4 mt-6 sm:grid-cols-2"
      >
        <motion.div variants={fadeInUp}>
          <Link href="/register/patient">
            <div className="group h-full overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="flex flex-col items-center text-center h-full gap-4">
                <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/15 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">Construction Worker</h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Create an account as a construction worker to access mental health resources and support.
                  </p>
                </div>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Register as Worker
                </Button>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Link href="/register/therapist">
            <div className="group h-full overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="flex flex-col items-center text-center h-full gap-4">
                <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/15 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">Mental Health Professional</h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Create an account as a licensed therapist to provide support and resources.
                  </p>
                </div>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Register as Therapist
                </Button>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </div>
    </AuthLayout>
  );
}
