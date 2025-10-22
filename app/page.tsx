import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

export default async function App() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Redirect based on role
  if (profile?.role === 'therapist') {
    redirect("/dashboard");
  } else if (profile?.role === 'patient') {
    redirect("/patient/dashboard");
  }

  // Default to admin dashboard
  redirect("/dashboard");
}