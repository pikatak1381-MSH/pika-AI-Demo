// hooks/useConversations.ts
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRef } from 'react'

interface Conversation {
  user_id: string
  conversation_id: number
  created_at: string
  updated_at: string
}

interface PaginationInfo {
  skip: number
  limit: number
  total_conversations: number
  has_more: boolean
}

interface ConversationResponse {
  user_conversations: Conversation[]
  pagination: PaginationInfo
}

interface ConversationRequest {
  user_id: string
  skip: number
  limit: number
  total_conversations: number | null
}

interface UseConversationsOptions {
  user_id: string | undefined
  limit?: number
  enabled?: boolean
}

export function useAllUserConversations({
  user_id,
  limit = 10,
  enabled = true,
}: UseConversationsOptions) {
  // Store total_conversations across requests
  const totalConversationsRef = useRef<number | null>(null)

  const query = useInfiniteQuery({
    queryKey: ['conversations', user_id],
    queryFn: async ({ pageParam = 0 }) => {
      // This should never happen due to enabled check, but TypeScript safety
      if (!user_id) {
        throw new Error('User ID is required')
      }

      const body: ConversationRequest = {
        user_id,
        skip: pageParam,
        limit,
        // Send null on first request, then send the total from backend
        total_conversations: totalConversationsRef.current,
      }

      const response = await fetch('/api/chat/user-conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail?.[0]?.msg || 'Failed to fetch conversations')
      }

      const data: ConversationResponse = await response.json()

      // Store total_conversations for subsequent requests
      if (data.pagination.total_conversations !== undefined) {
        totalConversationsRef.current = data.pagination.total_conversations
      }

      return data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // If has_more is false, return undefined to stop pagination
      if (!lastPage.pagination.has_more) {
        return undefined
      }

      // Calculate next skip value
      const nextSkip = lastPage.pagination.skip + lastPage.pagination.limit
      
      return nextSkip
    },
    enabled: enabled && !!user_id, // Only fetch when user_id exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
  })

  // Flatten all pages into a single array
  const allConversations =
    query.data?.pages.flatMap((page) => page.user_conversations) ?? []

  // Get pagination info from the last page
  const pagination = query.data?.pages[query.data.pages.length - 1]?.pagination

  return {
    conversations: allConversations,
    pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  }
}