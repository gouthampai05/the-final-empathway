import { useRouter } from 'next/navigation';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { mapAuthErrorMessage } from '@/lib/authErrorMessages';
import { authenticateUser, registerBasicUser, registerPatient } from '../services/authService';
import type { LoginFormData, PatientRegistrationData } from '../types';

export const useAuth = () => {
  const router = useRouter();
  const { loading, error, submitForm } = useFormSubmission(mapAuthErrorMessage);

  const login = async (data: LoginFormData) => {
    await submitForm(async () => {
      const redirectPath = await authenticateUser(data);
      if (redirectPath) {
        window.location.href = redirectPath;
      }
    });
  };

  const registerTherapist = async (data: { email: string; password: string }) => {
    await submitForm(async () => {
      const result = await registerBasicUser({
        email: data.email,
        password: data.password,
        role: "therapist"
      });
      if (result?.redirectTo) {
        router.push(result.redirectTo);
      }
    });
  };

  const registerPatientUser = async (data: PatientRegistrationData & { profilePic: string }) => {
    await submitForm(async () => {
      await registerPatient(data);
    });
  };

  return {
    login,
    registerTherapist,
    registerPatient: registerPatientUser,
    loading,
    error
  };
};
