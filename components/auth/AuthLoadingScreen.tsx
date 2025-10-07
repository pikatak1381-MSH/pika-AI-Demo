"use client"

import Image from "next/image"

export const AuthLoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 relative animate-pulse">
          <Image
            src="/logos/pika-ai-logo.png"
            alt="Pika AI Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">در حال بارگذاری...</p>
      </div>
    </div>
  )
}