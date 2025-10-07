import { useChatUIStore } from "@/stores/useChatUIStore"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export const useNewConversation = () => {
  const { setActiveConversation } = useChatUIStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  const startNewConversation = () => {
    // Resetting store state
    setActiveConversation(null)

    // Clearing cached conversations
    queryClient.removeQueries({ queryKey: ["conversation"] })

    // Redirecting to welcome page
    router.push("/chat")
  }

  return { startNewConversation }
}
