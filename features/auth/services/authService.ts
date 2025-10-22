import { createClient as createSupabaseClient } from "@/supabase/client";
import type { LoginFormData, TherapistRegistrationData, PatientRegistrationData, AuthResponse, CompleteTherapistProfileData } from "../types";

export const authenticateUser = async (credentials: LoginFormData): Promise<string> => {
  const supabase = createSupabaseClient();
  console.log("[auth] authenticateUser:start", { email: credentials.email, role: credentials.role });
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password
  });

  if (error) {
    console.error("[auth] authenticateUser:signInWithPassword:error", error);
    throw new Error(error.message || "Invalid email or password. Please try again.");
  }

  // Determine redirect by role. Prefer profile.role; fall back to submitted role.
  const userId = data.user?.id;
  let role: "patient" | "therapist" | undefined = credentials.role;
  if (userId) {
    console.log("[auth] authenticateUser:logged-in", { userId });
    let { data: profileRow } = await supabase
      .from("profiles")
      .select("role, name, phone_number, company_name")
      .eq("id", userId)
      .maybeSingle();
    console.log("[auth] authenticateUser:profileRow", profileRow);
    // Also read completion flag from auth metadata
    let therapistProfileCompleted = false;
    try {
      const { data: userResp } = await supabase.auth.getUser();
      therapistProfileCompleted = !!userResp.user?.user_metadata?.therapistProfileCompleted;
    } catch {}
    if (profileRow?.role === "patient" || profileRow?.role === "therapist") {
      role = profileRow.role;
    }

    // Ensure registration data is complete post-login (handles email-confirmation flow)
    try {
      console.log("[auth] authenticateUser:calling completeRegistration");
      await completeRegistration();
      const { data: verifyProfile } = await supabase
        .from("profiles")
        .select("role, name, phone_number, company_name")
        .eq("id", userId)
        .maybeSingle();
      console.log("[auth] authenticateUser:post-completion profile", verifyProfile);
      if (verifyProfile) {
        profileRow = verifyProfile;
        if (verifyProfile.role === "patient" || verifyProfile.role === "therapist") {
          role = verifyProfile.role;
        }
      }
    } catch {
      // Best-effort; proceed with redirect even if completion fails
      console.warn("[auth] authenticateUser:completeRegistration failed (non-fatal)");
    }

    // After login, if therapist profile is incomplete (and not flagged completed), route to complete-profile
    try {
      const { data: therapistRow } = await supabase
        .from("therapists")
        .select("id, years_experience")
        .eq("id", userId)
        .maybeSingle();

      const needsTherapistDetails = (role === "therapist") && !therapistProfileCompleted && (
        !profileRow?.name || !profileRow?.phone_number || !profileRow?.company_name || !therapistRow
      );

      if (needsTherapistDetails) {
        return "/therapist/details";
      }
    } catch (e) {
      console.warn("[auth] authenticateUser:therapist completeness check failed", e);
    }
  }

  if (role === "patient") return "/patient/dashboard";
  if (role === "therapist") return "/dashboard";
  return "/";
};

export const registerBasicUser = async (data: { email: string; password: string; role: "therapist" | "patient" }): Promise<AuthResponse> => {
  const supabase = createSupabaseClient();

  // Create auth user with role metadata; with email confirmation disabled, Supabase should return a session
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: { role: data.role } }
  });

  if (signUpError) {
    throw new Error(signUpError.message || "Failed to register user.");
  }

  const userId = signUpData.user?.id;
  const hasSession = !!signUpData.session;

  if (!hasSession || !userId) {
    throw new Error("Registration failed to establish a session. Please try logging in.");
  }

  // Upsert base profile
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      email: data.email,
      name: "",
      phone_number: "",
      company_name: "",
      role: data.role,
      profile_pic_url: null
    }, { onConflict: "id" });
  if (profileError) {
    throw new Error(profileError.message || "Failed to create profile.");
  }

  // Upsert role-specific
  if (data.role === "therapist") {
    const { error: therapistError } = await supabase.from("therapists").upsert({
      id: userId,
      years_experience: 0,
      expertise: [],
      bio: null
    }, { onConflict: "id" });
    if (therapistError) {
      throw new Error(therapistError.message || "Failed to save therapist details.");
    }
  } else if (data.role === "patient") {
    const { error: patientError } = await supabase.from("patients").upsert({ id: userId }, { onConflict: "id" });
    if (patientError) {
      throw new Error(patientError.message || "Failed to save patient details.");
    }
  }

  const redirectTo = data.role === "therapist" ? "/therapist/details" : "/patient/complete-profile";
  return {
    message: "Account created and logged in.",
    redirectTo
  };
};

export const registerPatient = async (data: PatientRegistrationData): Promise<AuthResponse> => {
  const supabase = createSupabaseClient();

  // Basic guard
  if (data.phoneNumber.length < 10) {
    throw new Error("Please enter a valid phone number with at least 10 digits.");
  }

  console.log("[auth] registerPatient:signUp:payload", {
    email: data.email,
    meta: {
      role: "patient",
      name: data.name,
      phoneNumber: data.phoneNumber,
      companyName: data.companyName,
      profilePic: !!data.profilePic
    }
  });
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        role: "patient",
        name: data.name,
        phoneNumber: data.phoneNumber,
        companyName: data.companyName,
        profilePic: data.profilePic ?? null
      }
    }
  });

  if (signUpError) {
    console.error("[auth] registerPatient:signUp:error", signUpError);
    throw new Error(signUpError.message || "Failed to register patient.");
  }

  const userId = signUpData.user?.id;
  if (!userId) {
    throw new Error("Unable to create user account.");
  }
  console.log("[auth] registerPatient:signUp:success", { userId, hasSession: !!signUpData.session });

  // If session exists, upsert profile now; otherwise rely on DB trigger and finish later.
  if (signUpData.session) {
    console.log("[auth] registerPatient:upsert profile (has session)");
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email: data.email,
        name: data.name,
        phone_number: data.phoneNumber,
        company_name: data.companyName,
        role: "patient",
        profile_pic_url: data.profilePic ?? null
      }, { onConflict: "id" });
    if (profileError) {
      console.error("[auth] registerPatient:profile upsert error", profileError);
      throw new Error(profileError.message || "Failed to create profile.");
    }
  }

  // Create patient row only if we have a session (no email confirmation)
  if (signUpData.session) {
    console.log("[auth] registerPatient:insert patient (has session)");
    const { error: patientError } = await supabase.from("patients").insert({
      id: userId
    });
    if (patientError && patientError.code !== "23505") {
      console.error("[auth] registerPatient:patients insert error", patientError);
      throw new Error(patientError.message || "Failed to save patient details.");
    }
  }

  const needsEmailConfirmation = !signUpData.session;
  return {
    message: needsEmailConfirmation
      ? "Check your email to confirm your account."
      : "Patient registration successful",
    redirectTo: "/patient/dashboard"
  };
};

// Complete registration after email confirmation
export const completeRegistration = async (): Promise<AuthResponse> => {
  const supabase = createSupabaseClient();
  console.log("[auth] completeRegistration:start");
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("[auth] completeRegistration:getUser:error", userError);
    throw new Error("User not authenticated");
  }

  const userId = user.id;
  const userMetadata = user.user_metadata;
  const role = userMetadata?.role;
  console.log("[auth] completeRegistration:user", { userId, role, userMetadata });

  // Try to get registration data from localStorage as fallback
  let pendingMeta = null;
  try {
    const stored = localStorage.getItem("pendingRegistrationMeta");
    if (stored) {
      pendingMeta = JSON.parse(stored);
      console.log("[auth] completeRegistration:found localStorage data", pendingMeta);
    }
  } catch (e) {
    console.warn("[auth] completeRegistration:localStorage parse error", e);
  }

  // Merge any pending therapist details saved on the details page
  let pendingTherapistDetails = null;
  try {
    const storedDetails = localStorage.getItem("pendingTherapistDetails");
    if (storedDetails) {
      pendingTherapistDetails = JSON.parse(storedDetails);
      console.log("[auth] completeRegistration:found pendingTherapistDetails", pendingTherapistDetails);
    }
  } catch (e) {
    console.warn("[auth] completeRegistration:localStorage therapist details parse error", e);
  }

  // Use localStorage data if userMetadata is incomplete
  const finalRole = role || pendingMeta?.role;
  const finalName = userMetadata?.name || pendingMeta?.name || "";
  const finalPhoneNumber = userMetadata?.phoneNumber || pendingMeta?.phoneNumber || "";
  const finalCompanyName = userMetadata?.companyName || pendingMeta?.companyName || "";
  const finalProfilePic = userMetadata?.profilePic || pendingMeta?.profilePic || pendingTherapistDetails?.profilePic || null;

  if (!finalRole || (finalRole !== "patient" && finalRole !== "therapist")) {
    throw new Error("Invalid user role");
  }

  console.log("[auth] completeRegistration:final data", {
    role: finalRole,
    name: finalName,
    phoneNumber: finalPhoneNumber,
    companyName: finalCompanyName
  });

  // Complete profile with metadata
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      email: user.email!,
      name: finalName,
      phone_number: finalPhoneNumber,
      company_name: finalCompanyName,
      role: finalRole,
      profile_pic_url: finalProfilePic
    }, { onConflict: "id" });

  if (profileError) {
    console.error("[auth] completeRegistration:profile upsert error", profileError);
    throw new Error(profileError.message || "Failed to complete profile");
  }

  // Create role-specific record
  if (finalRole === "therapist") {
    const finalYearsExperience = userMetadata?.yearsExperience || pendingMeta?.yearsExperience || pendingTherapistDetails?.yearsExperience || "0";
    const finalExpertise = userMetadata?.expertise || pendingMeta?.expertise || pendingTherapistDetails?.expertise || [];
    const finalBio = userMetadata?.bio || pendingMeta?.bio || pendingTherapistDetails?.bio || null;

    const { error: therapistError } = await supabase.from("therapists").upsert({
      id: userId,
      years_experience: parseInt(finalYearsExperience, 10),
      expertise: finalExpertise,
      bio: finalBio
    }, { onConflict: "id" });

    if (therapistError) {
      console.error("[auth] completeRegistration:therapists upsert error", therapistError);
      throw new Error(therapistError.message || "Failed to complete therapist profile");
    }
  } else if (finalRole === "patient") {
    const { error: patientError } = await supabase.from("patients").upsert({
      id: userId
    }, { onConflict: "id" });

    if (patientError) {
      console.error("[auth] completeRegistration:patients upsert error", patientError);
      throw new Error(patientError.message || "Failed to complete patient profile");
    }
  }

  // Clean up localStorage after successful completion
  try {
    localStorage.removeItem("pendingRegistrationMeta");
    localStorage.removeItem("pendingTherapistDetails");
  } catch (e) {
    console.warn("[auth] completeRegistration:localStorage cleanup error", e);
  }

  const { data: finalProfile } = await supabase
    .from("profiles")
    .select("role, phone_number, company_name")
    .eq("id", userId)
    .maybeSingle();
  console.log("[auth] completeRegistration:final profile", finalProfile);

  return {
    message: "Registration completed successfully",
    redirectTo: finalRole === "patient" ? "/patient/dashboard" : "/therapist/dashboard"
  };
};

export const completeTherapistProfile = async (data: CompleteTherapistProfileData): Promise<{ success: boolean; message: string }> => {
  const supabase = createSupabaseClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const userId = user.id;

  // Update profile
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      email: user.email!,
      name: data.name,
      phone_number: data.phoneNumber,
      company_name: data.companyName,
      role: "therapist",
      profile_pic_url: data.profilePic
    }, { onConflict: "id" });

  if (profileError) {
    console.error("[auth] completeTherapistProfile:profile upsert error", profileError);
    throw new Error(profileError.message || "Failed to update profile.");
  }

  // Update therapist record
  const { error: therapistError } = await supabase.from("therapists").upsert({
    id: userId,
    years_experience: parseInt(data.yearsExperience, 10),
    expertise: data.expertise,
    bio: data.bio || null
  }, { onConflict: "id" });

  if (therapistError) {
    console.error("[auth] completeTherapistProfile:therapists upsert error", therapistError);
    throw new Error(therapistError.message || "Failed to update therapist details.");
  }

  // Mark completion in auth metadata to persist across sessions
  try {
    await supabase.auth.updateUser({
      data: { therapistProfileCompleted: true }
    });
  } catch (e) {
    console.warn("[auth] completeTherapistProfile:updateUser metadata failed (non-fatal)", e);
  }

  return {
    success: true,
    message: "Profile completed successfully"
  };
};
