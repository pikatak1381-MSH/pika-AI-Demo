import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ChatUIState {
  activeConversationId: number | null
  setActiveConversation: (id: number | null) => void
  clearConversation: () => void
}

export const useChatUIStore = create<ChatUIState>()(
  persist(
    (set) => ({
      activeConversationId: null,
      setActiveConversation: (id) => set({ activeConversationId: id }),
      clearConversation: () => set({ activeConversationId: null }),
    }),
    {
      name: "chat-ui-storage", 
    }
  )
)