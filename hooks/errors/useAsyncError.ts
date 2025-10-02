" use client"

import { useState } from "react"

export function useAsyncError() {
  const [error, setError] = useState<string | null>(null)
  const throwError = (message: string) => {
    console.error(message)
    setError(message)
  }
  return { error, throwError, clearError: () => setError(null) }
}
