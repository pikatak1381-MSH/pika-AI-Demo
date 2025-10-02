import { useAuthStore } from "@/stores/useAuthStore"
import { useChatUIStore } from "@/stores/useChatUIStore"
import { useAiVersionStore } from "@/stores/useAiVersionStore"
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

/* ----------------------------- Types ----------------------------- */

interface SendMessageParams {
  content: string
  autoRedirect?: boolean
  conversationId?: number
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

export const useConversation1 = (routeConversationId?: string | number | null) => {
  const { endpoint } = useAiVersionStore()
  const { activeConversationId, setActiveConversation } = useChatUIStore()
  const { userId, token } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()
  
  // Tracking if initial message has been sent to prevent duplicates
  const initialMessageSent = useRef(false)
  const lastConversationId = useRef<number | null>(null)

  // Normalizing route param or fallback to store
  const normalizedRouteId = normalizeConversationId(routeConversationId)
  const conversationId = normalizedRouteId ?? activeConversationId

  /* ---------------- Syncing Route and Store ---------------- */
  useEffect(() => {
    if (normalizedRouteId && normalizedRouteId !== activeConversationId) {
      setActiveConversation(normalizedRouteId)
    }
  }, [normalizedRouteId, activeConversationId, setActiveConversation])

  // Reseting tracking when conversation changes
  useEffect(() => {
    if (conversationId !== lastConversationId.current) {
      initialMessageSent.current = false
      lastConversationId.current = conversationId
    }
  }, [conversationId])

  /* ---------------- Fetching Conversation Messages ---------------- */
  const { data, isLoading } = useQuery<ConversationMessagesResponse>({
    queryKey: conversationId ? ["conversation", conversationId] : [],
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
    staleTime: 5 * 60 * 1000, // Considering data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keeping in cache for 30 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Preventing refetch when tab regains focus
    refetchOnMount: false, // Not refetching if data exists in cache
  })

  const messages: ChatMessageType[] = data?.messages ?? []

  /* ---------------- Sending Message Mutation ---------------- */
  const sendMessage = useMutation<
    ChatbotResponse & { conversation_id: number },
    Error,
    SendMessageParams,
    MutationContext
  >({
    mutationFn: async ({ content, conversationId: providedConversationId }) => {
      if (!userId || !token) throw new Error("Not authenticated")

      const effectiveId =
        providedConversationId ?? conversationId ?? activeConversationId

      if (!effectiveId) {
        throw new Error("No conversation id provided. Create one first.")
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversation_id: effectiveId,
          context: content,
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to send message: ${res.status} ${text}`)
      }

      return { ...(await res.json()), conversation_id: effectiveId }
    },

    /* --- Upadting Optimistically --- */
    onMutate: async ({ content, conversationId: providedConversationId }) => {
      const effectiveId =
        providedConversationId ?? conversationId ?? activeConversationId
      if (!effectiveId) {
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

    /* --- Rolling back on error --- */
    onError: (_err, _variables, context) => {
      if (context?.effectiveId) {
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

    /* --- Replacing temp messages with real data --- */
    onSuccess: (data, _variables, context) => {
      const effectiveId = context?.effectiveId ?? data.conversation_id
      if (!effectiveId) return

      const queryKey = ["conversation", effectiveId]

      queryClient.setQueryData<ConversationMessagesResponse>(queryKey, (old) => {
        const withoutTemps = (old?.messages ?? []).filter(
          (m) => m.id !== context?.tempUserId && m.id !== context?.tempAiId
        )

        const userMessage: ChatMessageType = {
          id: `u-${data.input_message_id}`,
          role: "user",
          content: data.context,
        }

        const aiMessage: ChatMessageType = {
          id: `a-${data.answer_id}`,
          role: "ai",
          content: {
            ...data,
            conversation_id: effectiveId,
          },
        }

        return { messages: [...withoutTemps, userMessage, aiMessage] }
      })
    },
  })

  /* ---------------- Creating New Conversation ---------------- */
  const createNewConversation = async (
    {
      autoRedirect = false,
      initialMessage,
    }: { autoRedirect?: boolean; initialMessage?: string } = {}
  ): Promise<number> => {
    if (!userId || !token) throw new Error("Not authenticated")

    // Step 1: Creating conversation in backend
    const res = await fetch("/api/chat/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: userId }),
    })

    if (!res.ok) throw new Error("Failed to create conversation")
    const data = await res.json()
    const newId = Number(data.conversation_id)

    // Step 2: Syncing state
    setActiveConversation(newId)

    // Step 3: Prehydrating cache with empty messages
    queryClient.setQueryData(["conversation", newId], { messages: [] })

    // Step 4: Marking initial message as pending
    if (initialMessage && !initialMessageSent.current) {
      initialMessageSent.current = true
      
      // Storing the initial message in session storage temporarily
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`pending_message_${newId}`, initialMessage)
      }
    }

    // Step 5: Redirecting
    if (autoRedirect) {
      router.replace(`/chat/${newId}`)
    }

    return newId
  }

  // Handling pending initial message after navigation
  useEffect(() => {
    if (conversationId && typeof window !== 'undefined') {
      const pendingMessage = sessionStorage.getItem(`pending_message_${conversationId}`)
      
      if (pendingMessage && !initialMessageSent.current) {
        initialMessageSent.current = true
        sessionStorage.removeItem(`pending_message_${conversationId}`)
        
        // Sending the message after a small delay to ensure component is ready
        setTimeout(() => {
          sendMessage.mutate({
            content: pendingMessage,
            conversationId: conversationId,
          })
        }, 100)
      }
    }
  }, [conversationId, sendMessage])

  /* ---------------- Selecting Products ---------------- */
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
    activeConversationId,
    selectProducts,
    hasActiveConversation: !!conversationId,
    isLoadingMessages: isLoading,
  }
}