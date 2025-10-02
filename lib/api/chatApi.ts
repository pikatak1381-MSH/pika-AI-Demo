import { ChatbotResponse, ConversationMessagesResponse } from "@/lib/types"

export const chatApi = {
  fetchMessages: async (conversationId: string, token: string): Promise<ConversationMessagesResponse> => {
    if (!conversationId || !token) return { messages: [] }
    
    const res = await fetch(`/api/chat/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Failed to fetch messages")
    return res.json()
  },

  createConversation: async (userId: string): Promise<{ conversation_id: string }> => {
    const res = await fetch("/api/chat/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
    })
    if (!res.ok) throw new Error("Failed to create conversation")
    return res.json()
  },

  sendMessage: async (conversationId: string, token: string, content: string, endpoint: string): Promise<ChatbotResponse> => {
    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ context: content, conversation_id: conversationId }),
    })
    if (!res.ok) throw new Error("Failed to send message")
    return res.json()
  },
}