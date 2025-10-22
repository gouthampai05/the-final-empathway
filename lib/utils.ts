import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the current date as an ISO string without milliseconds
 * @returns ISO date string in format YYYY-MM-DDTHH:mm:ss
 */
export function getCurrentDate(): string {
  const now = new Date()
  return now.toISOString().split('.')[0]
}
