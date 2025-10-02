import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function normalizeConversationId(id: string | undefined): number | null {
  if (!id) return null
  const parsed = Number(id)
  return Number.isNaN(parsed) ? null : parsed
}
