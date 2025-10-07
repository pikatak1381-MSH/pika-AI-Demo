import { useEffect, useRef } from "react"
import { useAuthUser } from "@/stores/useAuthStore"
import { useAllUserConversations } from "@/hooks/message/useAllUserConversations"

export function SidebarChatHistory() {
  const user = useAuthUser()
  const {
    conversations,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
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
    <div className="text-gray-400 text-sm text-center py-8">
      لطفا وارد اکانت شوید تا گفت‌وگوها را ببینید
    </div>    
  }

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
          مشکل در بارگیری گفت‌وها
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
            گفت‌وگویی یافت نشد
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conv) => (
              <ConversationItem key={conv.conversation_id} conversation={conv} />
            ))}

            {/* Sentinel element for infinite scroll */}
            <div ref={observerTarget} className="h-4" />

            {/* Loading indicator */}
            {isFetchingNextPage && (
              <div className="py-4 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
              </div>
            )}            

            {/* Intersection observer target */}
            <div ref={observerTarget} className="h-4" />

            {/* End of list indicator */}
            {!hasNextPage && conversations.length > 0 && (
              <div className="text-gray-500 text-xs text-center py-4">
                انتهای گفت‌وگوها
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
          گفت‌وگو {conversation.conversation_id}
        </span>
        <span className="text-xs text-gray-500 ml-2">{formattedDate}</span>
      </div>
    </button>
  )
}