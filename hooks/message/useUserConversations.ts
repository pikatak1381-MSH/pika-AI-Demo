import { useAuthStore } from "@/stores/useAuthStore"
import { useInfiniteQuery } from "@tanstack/react-query"

export interface UserConversation {
  conversation_id: number
  user_id: string
  created_at: string
  updated_at: string
}

export const useUserConversations = () => {
  const { userId } = useAuthStore()

  return useInfiniteQuery<UserConversation[]>({
    queryKey: ["userConversations", userId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `/api/chat/user/${userId}?skip=${pageParam}&limit=10`
      )
      if (!res.ok) throw new Error("Failed to fetch conversations")
      return res.json()
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined // no more pages
      return allPages.flat().length // skip = total conversations loaded so far
    },
    initialPageParam: 0,
    enabled: !!userId
  })
}
