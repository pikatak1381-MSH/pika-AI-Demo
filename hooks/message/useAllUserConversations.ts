"use client"

import { useAuthStore } from "@/stores/useAuthStore"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export interface UserConversation {
  conversation_id: number
  user_id: string
  created_at: string
  updated_at: string
}

interface ConversationsResponse {
  data: UserConversation[]
  pagination: {
    skip: number
    limit: number
    total: number
    hasMore: boolean
  }
}

const CONVERSATIONS_PER_PAGE = 20

export const useAllUserConversations = () => {
  const { userId } = useAuthStore()

  return useInfiniteQuery<ConversationsResponse>({
    queryKey: ["userConversations", userId],
    
    queryFn: async ({ pageParam }) => {
      if (!userId) throw new Error("User ID is required") 

        const skip = (pageParam as number) ?? 0

        /* Temp Debugg Log */
        console.log("Fetching conversations:", { skip, limit: CONVERSATIONS_PER_PAGE, userId })

        const res = await fetch(
            `/api/chat/user-conversations/${userId}?skip=${skip}&limit=${CONVERSATIONS_PER_PAGE}`,
            {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // Preventing caching issues
            cache: "no-store",
            }
        )

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(
            errorData.error || `Failed to fetch conversations: ${res.status}`
            )
        }

        const data = await res.json()
        /* Temp Debugg Log */
        console.log("Recieved data:", {
            conversationsCount: data.data?.length,
            pagination: data.pagination
        })
        return data
    },

    getNextPageParam: (lastPage) => {
        const nextParam = lastPage.pagination.hasMore 
            ? lastPage.pagination.skip + lastPage.pagination.limit 
            : undefined
        
        console.log("📄 getNextPageParam:", {
            hasMore: lastPage.pagination.hasMore,
            currentSkip: lastPage.pagination.skip,
            limit: lastPage.pagination.limit,
            nextParam
        })
      
        return nextParam
    },
        initialPageParam: 0,
        enabled: !!userId,
        staleTime: 30_000, // 30 seconds
        gcTime: 5 * 60_000, // 5 minutes (formerly cacheTime)
        refetchOnWindowFocus: false,
        retry: 2,
    })
}

// Helper hook to flatten all conversations
export const useAllConversations = () => {
    const query = useAllUserConversations()
    
    const allConversations = query.data?.pages.flatMap(page => page.data) ?? []
    const totalCount = query.data?.pages[0]?.pagination.total ?? 0

  // Debug logging
  useEffect(() => {
    console.log("📊 Conversations state:", {
      loadedConversations: allConversations.length,
      totalCount,
      hasNextPage: query.hasNextPage,
      isFetchingNextPage: query.isFetchingNextPage,
      pagesLoaded: query.data?.pages.length
    })
  }, [allConversations.length, totalCount, query.hasNextPage, query.isFetchingNextPage, query.data?.pages.length])    
  
    return {
        ...query,
        conversations: allConversations,
        totalCount,
        isLoadingMore: query.isFetchingNextPage,
        loadMore: query.fetchNextPage,
        canLoadMore: query.hasNextPage,
    }
}