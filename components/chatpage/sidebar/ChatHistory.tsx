"use client"

import { useAllUserConversations } from "@/hooks/message/useAllUserConversations"
import { useEffect, useRef } from "react"
import { useAuthUser } from "@/stores/useAuthStore"


const ChatHistory = () => {
  const user = useAuthUser()
  const {
    conversations,
    pagination,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useAllUserConversations({
    user_id: user?.userId,
    limit: 10,
  })

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const observerTarget = useRef<HTMLDivElement>(null)

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // When the sentinel element is visible and we have more pages
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: "100px", // Load before reaching the bottom
        threshold: 0.1,
      }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (!user) {
    return (
      <aside className="w-64  border-r border-gray-700 p-4">
        <div className="text-gray-400 text-sm text-center py-8">
          لطفا وارد اکانت شوید تا گفتگوها را ببینید
        </div>
      </aside>
    )
  }

  if (isLoading) {
    return (
      <aside className="w-64  border-r border-gray-700 p-4">
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-800 rounded animate-pulse"
            />
          ))}
        </div>
      </aside>
    )
  }

  if (isError) {
    return (
      <aside className="w-64  border-r border-gray-700 p-4">
        <div className="text-red-400 text-sm">
          :خطا {error instanceof Error ? error.message : "مشکل در بارگیری گفتگوها"}
        </div>
      </aside>
    )
  }
  
  return (
    <div>
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold">گفتگوها</h2>
        {pagination && (
          <p className="text-gray-400 text-xs mt-1">
            {conversations.length} of {pagination.total_conversations}
          </p>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {conversations.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-8">
            گتفگویی یافت نشد
          </div>
        ) : (
          <>
            {conversations.map((conversation) => (
              <div
                key={conversation.conversation_id}
                className="p-3  rounded  cursor-pointer transition-colors"
              >
                <div className="text-white text-sm font-medium">
                  گفتگو {conversation.conversation_id}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {new Date(conversation.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}

            {/* Sentinel element for infinite scroll */}
            <div ref={observerTarget} className="h-4" />

            {/* Loading indicator */}
            {isFetchingNextPage && (
              <div className="py-4 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
              </div>
            )}

            {/* End of list indicator */}
            {!hasNextPage && conversations.length > 0 && (
              <div className="text-gray-500 text-xs text-center py-4">
                انتهای گفتگوها
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ChatHistory