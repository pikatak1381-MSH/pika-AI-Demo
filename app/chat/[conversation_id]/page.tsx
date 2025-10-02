"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { useConversation1 } from "@/hooks/message/useConversation1"
import { useChatUIStore } from "@/stores/useChatUIStore"
import ScrollAnchor from "@/components/ui/ScrollAnchor"
import ChatWindow from "@/components/chatpage/chatsection/ChatWindow"
import SkeletonUi from "@/components/ui/skeletons/SkeletonUi"
import { motion } from "framer-motion"
import { ArrowUp, Plus, ClipboardList } from "lucide-react"

const DynamicChatPage = () => {
  const [input, setInput] = useState("")
  const [height, setHeight] = useState<number>(40)

  const params = useParams<{ conversation_id: string }>()
  const routeId = params?.conversation_id ? Number(params.conversation_id) : null

  const { setActiveConversation } = useChatUIStore()
  
  const { 
    sendMessage, 
    sending, 
    messages, 
    activeConversationId,
    isLoadingMessages 
  } = useConversation1(routeId)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasInitialized = useRef(false)

  /* Resizing textarea automatically */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const newHeight = Math.min(textareaRef.current.scrollHeight, 160)
      setHeight(newHeight)
    }
  }, [input])

  /* Initialize conversation once on mount */
  useEffect(() => {
    if (routeId && !hasInitialized.current) {
      hasInitialized.current = true
      setActiveConversation(routeId)
    }
  }, [routeId, setActiveConversation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const message = input.trim()
    if (!message || !activeConversationId || sending) return

    // Clearing input immediately
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"
      setHeight(40)
    }

    sendMessage({
      content: message,
      conversationId: activeConversationId,
    })
  }

  // Showing loading state while fetching messages
  if (isLoadingMessages) {
    return <SkeletonUi />
  }

  return (
    <>
      <div className="w-full flex-1 flex flex-col items-center overflow-y-auto px-4 py-6">
        <ChatWindow 
          messages={messages}
          key={activeConversationId}
        />
        <ScrollAnchor />
      </div>

      <div className="w-full bg-[#f9f9f9] p-4">
        <form
          className="w-full max-w-3xl flex items-center justify-between p-1.5 border border-[#939393] rounded-4xl bg-[#FBFBFF] shadow-[5px_5px_10px_5px_#0000000D] hover:bg-[#E0E0E0] transition-colors duration-700 mx-auto z-20 overflow-hidden"
          onSubmit={handleSubmit}
        >
          {/* Input */}
          <motion.div
            className="relative w-full h-10 max-h-40"
            initial={{ height: 40 }}
            animate={{ height }}
            transition={{ duration: 0.2, ease: "easeInOut" }}          
          >
            <motion.textarea
              className="peer w-full p-2 resize-none placeholder-transparent focus-visible:outline-none overflow-y-auto"
              ref={textareaRef}
              placeholder="متن را بنویسید..."
              initial={{ height: 40 }}
              animate={{ height }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = "auto"
                e.target.style.height = `${e.target.scrollHeight}px`
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              disabled={sending}
            />

            <span
              className="w-full pointer-events-none absolute inset-0 flex items-center justify-start text-gray-400 peer-focus:hidden peer-not-placeholder-shown:hidden"
            >
              متن را بنویسید...
            </span>
          </motion.div>

          {/* Buttons */}
          <div className="flex items-center gap-4 h-full">
            <button
              type="button"
              className="hover:bg-[#EFEFEF] p-1 rounded-full transition-colors"
            >
              <ClipboardList size={22}/>
            </button>

            <button
              type="button"
              className="hover:bg-[#EFEFEF] p-1 rounded-full transition-colors"
            >
              <Plus size={22}/>
            </button>

            <button
              className="mr-1 rounded-full p-2 bg-[#D2D2D3] hover:bg-[#EFEFEF] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={sending || !input.trim()}
            >
              <ArrowUp size={24} className="text-[#3F3F3F]" />
            </button>
          </div>
        </form>
        <p className="text-center mt-2 text-xs md:text-sm text-[#797979]">
          هوش مصنوعی پیکاتک ممکن است اشتباه کند. اطلاعات مهم را حتماً بررسی کنید.
        </p>
      </div>
    </>
  )
}

export default DynamicChatPage