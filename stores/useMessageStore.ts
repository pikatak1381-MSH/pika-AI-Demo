import { ChatMessageType, ChatbotResponse } from "@/lib/types"
import { create } from "zustand"

interface MessageStore {
    conversations: Record<string, ChatMessageType[]>
    activeConversationId: string | null
    isChatEmpty: boolean
    setActiveConversation: (id: string) => void
    addMessage: (msg: ChatMessageType, conversationId?: string) => void
    clearMessages: (conversationId?: string) => void
    getMessages: (conversationId?: string) => ChatMessageType[]
    replaceConversationId: (tempId: string, realId: string) => void
    lockMessage: (
        messageId: string | number, 
        selectedProducts: ChatbotResponse["offered_product_answer"][number]["offers"],
        conversationId?: string
    ) => void
}


export const useMessageStore = create<MessageStore>((set, get) => ({
    conversations: {},
    activeConversationId: null,
    isChatEmpty: true,
    selectedProducts: [],

    setActiveConversation: (id) => set({  activeConversationId: id }),
    
    addMessage: (msg, conversationId) => {
        const id = conversationId || get().activeConversationId

        if (!id) return
        
        set((state) => ({
            conversations: {
                ...state.conversations,
                [id]: [...(state.conversations[id] || []), msg],
            },
        }))
    },

    clearMessages: (conversationId) => {
        const id = conversationId || get().activeConversationId

        if (!id) return

        set((state) => ({
            conversations: { ...state.conversations, [id]: [] },
        }))
    },
    
    getMessages: (conversationId) => {
        const id = conversationId || get().activeConversationId

        return id ? get().conversations[id] || [] : []
    },

    replaceConversationId: (tempId, realId) => {
        set((state) => {
        const tempMessages = state.conversations[tempId] || []
        const newConversations = { ...state.conversations, [realId]: tempMessages }
        delete newConversations[tempId]
        
        return {
            conversations: newConversations,
            activeConversationId:
                state.activeConversationId === tempId ? realId : state.activeConversationId,
        }
        })
    },

    lockMessage: (messageId, selectedProducts, conversationId) => {
        const id = conversationId || get().activeConversationId

        if (!id) return

        set((state) => ({
            conversations: {
                ...state.conversations,
                [id]: state.conversations[id].map((msg) =>
                    msg.id === messageId
                    ? { ...msg, is_locked: true, selectedProducts }
                    : msg
                )
            }
        }))
    },
}))

