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
}

interface MutationContext {
    tempUserId: string | null
    tempAiId: string | null
    effectiveId: number | null
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
        onMutate: async ({ content, conversationId: providedConversationId }) => {
        const effectiveId = providedConversationId ?? conversationId ?? null

        // For new conversations, we can't optimistically update
        if (effectiveId === null) {
            return { tempUserId: null, tempAiId: null, effectiveId: null }
        }

        const queryKey = ["conversation", effectiveId]
        await queryClient.cancelQueries({ queryKey })
        const previous = queryClient.getQueryData<ConversationMessagesResponse>(queryKey)

        const tempUserId = `temp-user-${uuid()}`
        const tempAiId = `temp-ai-${uuid()}`

        queryClient.setQueryData<ConversationMessagesResponse>(queryKey, (old) => ({
            messages: [
            ...(old?.messages ?? []),
            { id: tempUserId, role: "user", content },
            {
                id: tempAiId,
                role: "ai",
                content: {
                intro_answer: "...",
                conversation_id: Number(effectiveId),
                answer_id: -1,
                available_flow_id: -1,
                input_message_id: -1,
                input_type: "text",
                is_success: true,
                created_at: new Date().toISOString(),
                offered_product_answer: [],
                summary_answer: "",
                is_locked: false,
                context: "",
                },
            },
            ],
        }))

        return { tempUserId, tempAiId, effectiveId, previous }
        },

        /* --- Rollback on Error --- */
        onError: (_err, _variables, context) => {
        if (context?.effectiveId && context.effectiveId !== null) {
            const queryKey = ["conversation", context.effectiveId]
            if (context.previous) {
            queryClient.setQueryData(queryKey, context.previous)
            } else {
            queryClient.setQueryData<ConversationMessagesResponse>(queryKey, (old) => ({
                messages: (old?.messages ?? []).filter(
                (m) => m.id !== context.tempUserId && m.id !== context.tempAiId
                ),
            }))
            }
        }
        },

        /* --- Update Cache with Real Data --- */
        onSuccess: (data, _variables, context) => {
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
            // Initialize cache for new conversation
            queryClient.setQueryData<ConversationMessagesResponse>(queryKey, {
            messages: [userMessage, aiMessage],
            })
        } else {
            // Replace temp messages for existing conversation
            queryClient.setQueryData<ConversationMessagesResponse>(queryKey, (old) => {
            const withoutTemps = (old?.messages ?? []).filter(
                (m) => m.id !== context?.tempUserId && m.id !== context?.tempAiId
            )
            return { messages: [...withoutTemps, userMessage, aiMessage] }
            })
        }
        },
    })

    /* ---------------- Create New Conversation ---------------- */
    const createNewConversation = async ({
        autoRedirect = false,
        initialMessage,
    }: { autoRedirect?: boolean; initialMessage?: string } = {}): Promise<number | null> => {
        if (!user?.userId || !token) throw new Error("Not authenticated")

        if (initialMessage) {
        // Send message and create conversation
        const result = await sendMessage.mutateAsync({
            content: initialMessage,
            conversationId: null,
        })
        
        const newConversationId = result.conversation_id
        
        if (newConversationId) {
            // Update store synchronously BEFORE redirect
            setActiveConversation(newConversationId)
            
            // Redirect after state update
            if (autoRedirect) {
            router.push(`/chat/${newConversationId}`)
            }
        }
        
        return newConversationId
        }

        // No initial message - just prepare for new conversation
        setActiveConversation(null)
        
        if (autoRedirect) {
        router.push("/chat")
        }
        
        return null
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
        sending: sendMessage.isPending,
        sendError: sendMessage.error,
        createNewConversation,
        activeConversationId: conversationId,
        selectProducts,
        hasActiveConversation: !!conversationId,
        isLoadingMessages: isLoading,
    }
}