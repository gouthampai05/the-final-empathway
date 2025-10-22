import { useState } from "react";

/**
 * 
 * @tldr 
 * Handles loading/error states for any form submission. Pass your async submission
 * function to `submitForm()`, get back `loading` and `error` states. Eliminates boilerplate
 * 
 * 
 * Generic form submission hook that eliminates repetitive loading/error state management
 * across form components. This hook encapsulates the common pattern of setting loading
 * state, clearing previous errors, handling async operations, and managing cleanup.
 * 
 * @description Designed to solve the problem of duplicated boilerplate code that every
 * form submission requires - loading indicators, error handling, and state cleanup.
 * Rather than manually managing these states in each component, this hook provides
 * a consistent interface that handles the entire submission lifecycle.
 * 
 * @example
 * ```
 * const { loading, error, submitForm } = useFormSubmission();
 * 
 * const handleSubmit = async (data) => {
 *   await submitForm(async () => {
 *     const result = await authenticateUser(data);
 *     if (!result.success) {
 *       throw new Error(result.error);
 *     }
 *     router.push(result.redirectTo);
 *   });
 * };
 * ```
 * 
 * @returns {Object} Form submission state and handler
 * @returns {boolean} loading - Indicates if form submission is in progress. Used to disable
 *   submit buttons and show loading indicators, preventing double submissions and providing
 *   visual feedback to users during async operations.
 * @returns {string} error - Contains error message from failed submissions. Automatically
 *   cleared on each new submission attempt to avoid stale error states. Handles both Error
 *   objects and string errors with graceful fallback messaging.
 * @returns {Function} submitForm - Async function that wraps the actual submission logic.
 *   Designed to accept any async operation while managing the loading/error lifecycle.
 *   Uses Promise<void> to allow flexible business logic while maintaining type safety.
 * 
 * @param {Function} submitFn - The actual submission function to execute. Expected to be
 *   async and throw errors for failure cases. The hook will catch these errors and convert
 *   them to user-friendly error messages. Should contain all business logic for the specific
 *   form submission, while this hook handles the common state management concerns.
 */
export const useFormSubmission = (
  mapError?: (error: unknown) => string
) => {
  // Loading state prevents double submissions and provides user feedback during async operations
  const [loading, setLoading] = useState(false);
  
  // Error state is cleared on each submission to avoid displaying stale error messages
  const [error, setError] = useState("");
  
  /**
   * Wraps any async submission function with consistent loading/error state management.
   * The finally block ensures loading state is always reset, even if the submission
   * function throws an error or the component unmounts during execution.
   */
  const submitForm = async (submitFn: () => Promise<void>) => {
    setLoading(true);
    setError(""); // Clear previous errors to avoid confusion
    
    try {
      await submitFn();
    } catch (err) {
      // Handle both Error objects and string errors with graceful fallback
      // This ensures consistent error messaging regardless of how errors are thrown
      const friendly = mapError ? mapError(err) : (err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setError(friendly);
    } finally {
      // Always reset loading state to prevent UI from being stuck in loading state
      setLoading(false);
    }
  };
  
  return { loading, error, submitForm };
};
