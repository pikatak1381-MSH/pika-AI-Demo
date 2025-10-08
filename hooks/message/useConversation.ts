import { useAuthToken, useAuthUser } from "@/stores/useAuthStore"
import { useChatUIStore } from "@/stores/useChatUIStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ChatbotResponse,
  ChatMessageType,
  ConversationMessagesResponse,
  ProductOffer,
} from "@/lib/types"
import { v4 as uuid } from "uuid"
import { useAiVersionStore } from "@/stores/useAiVersionStore"

/* ----------------------------- Types ----------------------------- */
interface SendMessageParams {
    content: string
    conversationId?: number | null
    optimisticId?: string // For tracking optimistic updates across routes
}

interface MutationContext {
    tempUserId: string
    tempAiId: string
    effectiveId: number | null
    optimisticId?: string
    previous?: ConversationMessagesResponse
}

/* ----------------------------- Helpers ----------------------------- */
function normalizeConversationId(
  id?: string | number | null
): number | null {
  if (id === undefined || id === null) return null
    const parsed = typeof id === "string" ? Number(id) : id
    return Number.isNaN(parsed) ? null : parsed
}

/* ----------------------------- Hook ----------------------------- */
export const useConversation = (routeConversationId?: string | number | null) => {
    const { endpoint } = useAiVersionStore()
    const { activeConversationId, setActiveConversation } = useChatUIStore()
    const user = useAuthUser()
    const token = useAuthToken()
    const queryClient = useQueryClient()
    const router = useRouter()
    
    const lastConversationId = useRef<number | null>(null)

    // Normalize route param
    const normalizedRouteId = normalizeConversationId(routeConversationId)
    const conversationId = normalizedRouteId ?? activeConversationId

    /* ---------------- Sync Route and Store (ONCE) ---------------- */
    useEffect(() => {
        if (normalizedRouteId !== null && normalizedRouteId !== activeConversationId) {
            setActiveConversation(normalizedRouteId)
        }
    }, [normalizedRouteId, activeConversationId, setActiveConversation])

    // Reset tracking when conversation changes
    useEffect(() => {
        if (conversationId !== lastConversationId.current) {
            lastConversationId.current = conversationId
        }
    }, [conversationId])



    /* ---------------- Fetch Conversation Messages ---------------- */
    const { data, isLoading } = useQuery<ConversationMessagesResponse>({
        queryKey: ["conversation", conversationId ?? "new"],
        queryFn: async () => {
            if (!conversationId || !token) return { messages: [] }
            const res = await fetch(`/api/chat/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error("Failed to fetch messages")
            return res.json()
        },
        enabled: !!conversationId && !!token,
        initialData: { messages: [] },
        placeholderData: (previousData) => previousData, // Keep previous data during transitions
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    const messages: ChatMessageType[] = data?.messages ?? []



    /* ---------------- Send Message Mutation ---------------- */
    const sendMessage = useMutation<
        ChatbotResponse & { conversation_id: number },
        Error,
        SendMessageParams,
        MutationContext
    >({
        mutationFn: async ({ content, conversationId: providedConversationId }) => {
        if (!user?.userId || !token) throw new Error("Not authenticated")

        const effectiveId = providedConversationId ?? conversationId ?? null

        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
                body: JSON.stringify({
                context: content,
                conversation_id: effectiveId,
                user_id: user.userId,
            }),
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => null)
            
            if (res.status === 422 && errorData?.detail && Array.isArray(errorData.detail)) {
                const validationErrors = errorData.detail
                    .map((err: { loc: (string | number)[]; msg: string; type: string }) => err.msg)
                    .join(", ")
                throw new Error(`Validation error: ${validationErrors}`)
            }
            
            throw new Error(`Failed to send message: ${res.status}`)
        }

        const responseData = await res.json()
            return { ...responseData, conversation_id: responseData.conversation_id }
        },

        /* --- Optimistic Update --- */
        onMutate: async ({ content, conversationId: providedConversationId, optimisticId }) => {
            const effectiveId = providedConversationId ?? conversationId ?? null
            const tempUserId = optimisticId ? `temp-user-${optimisticId}` : `temp-user-${uuid()}`
            const tempAiId = optimisticId ? `temp-ai-${optimisticId}` : `temp-ai-${uuid()}`

            // For new conversations, we create optimistic state in "new" key
            const queryKey = effectiveId === null ? ["conversation", "new"] : ["conversation", effectiveId]
            
            await queryClient.cancelQueries({ queryKey })
            const previous = queryClient.getQueryData<ConversationMessagesResponse>(queryKey)

            queryClient.setQueryData<ConversationMessagesResponse>(queryKey, (old) => ({
                messages: [
                    ...(old?.messages ?? []),
                    { id: tempUserId, role: "user", content },
                    {
                        id: tempAiId,
                        role: "ai",
                        content: {
                            intro_answer: "...",
                            conversation_id: effectiveId ?? -1,
                            answer_id: -1,
                            available_flow_id: -1,
                            input_message_id: -1,
                            input_type: "text",
                            is_success: true,
                            created_at: new Date().toISOString(),
                            offered_product_answer: [],
                            summary_answer: "",
                            is_locked: false,
                            context: content,
                        },
                    },
                ],
            }))

            return { tempUserId, tempAiId, effectiveId, optimisticId, previous }
        },

        /* --- Rollback on Error --- */
        onError: (_err, _variables, context) => {
            if (!context) return
            
            const queryKey = context.effectiveId === null 
                ? ["conversation", "new"] 
                : ["conversation", context.effectiveId]
            
            if (context.previous) {
                queryClient.setQueryData(queryKey, context.previous)
            } else {
                queryClient.setQueryData<ConversationMessagesResponse>(queryKey, (old) => ({
                    messages: (old?.messages ?? []).filter(
                        (m) => m.id !== context.tempUserId && m.id !== context.tempAiId
                    ),
                }))
            }
        },

        /* --- Update Cache with Real Data --- */
        onSuccess: (data, variables, context) => {
            const newConversationId = data.conversation_id
            const wasNewConversation = context?.effectiveId === null

            if (!newConversationId) return

            const queryKey = ["conversation", newConversationId]

            const userMessage: ChatMessageType = {
                id: `u-${data.input_message_id}`,
                role: "user",
                content: data.context,
            }

            const aiMessage: ChatMessageType = {
                id: `a-${data.answer_id}`,
                role: "ai",
                content: data,
            }

            if (wasNewConversation) {
                // For new conversations, we need to:
                // 1. Update messages in place by replacing temp IDs
                // 2. Move from "new" key to actual conversation key
                const oldQueryKey = ["conversation", "new"]
                const oldData = queryClient.getQueryData<ConversationMessagesResponse>(oldQueryKey)
                
                if (oldData?.messages) {
                    // Replace the temp messages with real ones, preserving order
                    const updatedMessages = oldData.messages.map((msg) => {
                        if (msg.id === context?.tempUserId) {
                            return userMessage
                        }
                        if (msg.id === context?.tempAiId) {
                            return aiMessage
                        }
                        return msg
                    })
                    
                    // Set data in the new conversation key
                    queryClient.setQueryData<ConversationMessagesResponse>(queryKey, {
                        messages: updatedMessages,
                    })
                } else {
                    // Fallback: just set the messages
                    queryClient.setQueryData<ConversationMessagesResponse>(queryKey, {
                        messages: [userMessage, aiMessage],
                    })
                }
                
                // Clear the optimistic "new" conversation after a small delay
                // This prevents flash during transition
                setTimeout(() => {
                    queryClient.setQueryData<ConversationMessagesResponse>(oldQueryKey, {
                        messages: []
                    })
                }, 100)
            } else {
                // Replace temp messages for existing conversation
                queryClient.setQueryData<ConversationMessagesResponse>(queryKey, (old) => {
                    const updatedMessages = (old?.messages ?? []).map((msg) => {
                        if (msg.id === context?.tempUserId) {
                            return userMessage
                        }
                        if (msg.id === context?.tempAiId) {
                            return aiMessage
                        }
                        return msg
                    })
                    return { messages: updatedMessages }
                })
            }
        },
    })

    /* ---------------- Send Message with Instant Redirect ---------------- */
    const sendMessageWithRedirect = async (message: string): Promise<void> => {
        if (!user?.userId || !token) throw new Error("Not authenticated")
        
        // Generate a unique ID for this optimistic update
        const optimisticId = uuid()
        
        // Start the mutation (don't await yet)
        const mutationPromise = sendMessage.mutateAsync({
            content: message,
            conversationId: null,
            optimisticId,
        })
        
        // Immediately redirect to "new" conversation page with optimistic state
        router.push("/chat/new")
        
        // Wait for the actual response in the background
        try {
            const result = await mutationPromise
            const newConversationId = result.conversation_id
            
            if (newConversationId) {
                // Update active conversation
                setActiveConversation(newConversationId)
                
                // Replace URL without navigation (soft redirect)
                router.replace(`/chat/${newConversationId}`)
            }
        } catch (error) {
            console.error("Failed to send message:", error)
            // Error is already handled by onError in mutation
            throw error
        }
    }

    /* ---------------- Select Products ---------------- */
    const selectProducts = (messageId: string | number, offers: ProductOffer[]) => {
        if (!conversationId) return
        queryClient.setQueryData<ConversationMessagesResponse>(
            ["conversation", conversationId],
            (old) => ({
                messages:
                old?.messages.map((msg) =>
                    msg.id === messageId && msg.role === "ai"
                    ? { ...msg, selectedProducts: offers }
                    : msg
                ) ?? [],
            })
        )
    }
    
    return {
        messages,
        sendMessage: sendMessage.mutate,
        sendMessageAsync: sendMessage.mutateAsync,
        sendMessageWithRedirect,
        sending: sendMessage.isPending,
        sendError: sendMessage.error,
        activeConversationId: conversationId,
        selectProducts,
        hasActiveConversation: !!conversationId,
        isLoadingMessages: isLoading,
    }
}