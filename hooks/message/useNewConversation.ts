import { useChatUIStore } from "@/stores/useChatUIStore"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export const useNewConversation = () => {
  const { setActiveConversation } = useChatUIStore()
  const queryClient = useQueryClient()
  const router = useRouter()

  const startNewConversation = () => {
    // Step 1: Resetting store state
    setActiveConversation(null)

    // Step 2: Clearing cached conversations
    queryClient.removeQueries({ queryKey: ["conversation"] })

    // Step 3: Redirect to welcome page
    router.push("/chat")
  }

  return { startNewConversation }
}
