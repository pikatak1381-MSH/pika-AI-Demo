import { useEffect, useRef, useCallback } from "react"
import { useAllConversations } from "@/hooks/message/useAllUserConversations"

export function SidebarChatHistory() {
  const {
    conversations,
    totalCount,
    isLoading,
    isLoadingMore,
    isError,
    canLoadMore,
    loadMore,
    refetch,
  } = useAllConversations()

  const observerTarget = useRef<HTMLDivElement>(null)

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && canLoadMore && !isLoadingMore) {
        loadMore()
      }
    },
    [canLoadMore, isLoadingMore, loadMore]
  )

  useEffect(() => {
    const element = observerTarget.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px", // Loading before user reaches the end
      threshold: 0.1,
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [handleObserver])

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4">
        <div className="text-red-500 text-sm mb-2">
          مشکل در بارگیری گفگتوها
        </div>
        <button
          onClick={() => refetch()}
          className="text-sm text-blue-500 hover:underline"
        >
          دوباره تلاش کنید
        </button>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
        {conversations.length === 0 ? (
          <div className="p-4 text-gray-500 text-sm text-center">
            هیچ گفتگویی یافت نشد
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conv) => (
              <ConversationItem key={conv.conversation_id} conversation={conv} />
            ))}

            {/* Loading indicator when fetching more */}
            {isLoadingMore && (
              <div className="p-2 text-center">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            )}

            {/* Intersection observer target */}
            <div ref={observerTarget} className="h-4" />

            {/* Show count */}
            {!canLoadMore && conversations.length > 0 && (
              <div className="p-2 text-center text-xs text-gray-500 mt-2">
                {conversations.length} از {totalCount} گفت‌و‌گو
              </div>
            )}
          </div>
        )}
    </div>
  )
}

interface ConversationItemProps {
  conversation: {
    conversation_id: number
    created_at: string
    updated_at: string
  }
}

function ConversationItem({ conversation }: ConversationItemProps) {
  const date = new Date(conversation.created_at)
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  return (
    <button
      className="w-full text-right px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      onClick={() => {
        // Handle navigation to conversation
        console.log("Navigate to:", conversation.conversation_id)
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm truncate flex-1">
          گفتگو {conversation.conversation_id}
        </span>
        <span className="text-xs text-gray-500 ml-2">{formattedDate}</span>
      </div>
    </button>
  )
}