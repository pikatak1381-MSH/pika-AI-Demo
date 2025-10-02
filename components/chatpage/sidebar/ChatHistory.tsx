"use client"

import { useUserConversations } from "@/hooks/message/useUserConversations"
import { useRouter } from "next/navigation"
import { useChatUIStore } from "@/stores/useChatUIStore"
import { useEffect, useRef } from "react"


const ChatHistory = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useUserConversations()
  const { setActiveConversation, activeConversationId } = useChatUIStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!loaderRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage])

  useEffect(() => {
    // Scrolling to top whenever data changes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [data])

  const handleSelectConversation = (convId: number) => {
    setActiveConversation(convId)
    router.push(`/chat/${convId}`)
  }

  if (status === "pending") return <p className="text-sm text-gray-400 mt-2">در حال بارگذاری...</p>
  if (status === "error") return <p className="text-sm text-red-500 mt-2">خطا در بارگذاری گفت‌و‌گوها</p>

  const conversations = data?.pages.flat() ?? []

  return (
    <div 
      className="flex flex-col gap-1 px-1"
      ref={scrollRef}
    >
      {conversations.map((conv) => (
        <button
          key={conv.conversation_id}
          onClick={() => handleSelectConversation(conv.conversation_id)}
          className={`w-full text-right px-2 py-1 rounded hover:bg-gray-100 transition-colors duration-200 ${
            activeConversationId === conv.conversation_id ? "bg-gray-200 font-semibold" : ""
          }`}
        >
          گفت‌و‌گو {conv.conversation_id} 
        </button>
      ))}

      {/* Loader div */}
      <div
        className="h-8 flex items-center justify-center"
      >
        {isFetchingNextPage && (
          <p className="text-xs text-gray-400">در بارگذاری بیشتر...</p>
        )}
      </div>
    </div>
  )
}

export default ChatHistory