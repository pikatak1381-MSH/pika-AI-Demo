"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { useConversation } from "@/hooks/message/useConversation"
import ScrollAnchor from "@/components/ui/ScrollAnchor"
import ChatWindow from "@/components/chatpage/chatsection/ChatWindow"
import SkeletonUi from "@/components/ui/skeletons/SkeletonUi"
import { ArrowUp, Plus, ClipboardList } from "lucide-react"


const DynamicChatPage = () => {
  const [input, setInput] = useState("")

  const params = useParams<{ conversation_id: string }>()
  const routeId = params?.conversation_id ? Number(params.conversation_id) : null

  const { 
    sendMessage, 
    sending, 
    messages, 
    activeConversationId,
    isLoadingMessages 
  } = useConversation(routeId)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  /* Auto-resize textarea */
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to get accurate scrollHeight
    textarea.style.height = "auto"
    
    // Calculate new height (min 40px, max 160px)
    const newHeight = Math.max(40, Math.min(textarea.scrollHeight, 160))
    textarea.style.height = `${newHeight}px`
  }, [input])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const message = input.trim()
    if (!message || !activeConversationId || sending) return

    // Clear input immediately
    setInput("")
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"
    }

    sendMessage({
      content: message,
      conversationId: activeConversationId,
    })
  }

  // Show loading state while fetching messages
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
          className="w-full max-w-3xl flex items-end gap-3 py-2 px-4 border border-[#939393] rounded-4xl bg-[#FBFBFF] shadow-[5px_5px_10px_5px_#0000000D] hover:bg-[#E0E0E0] transition-colors duration-300 mx-auto"
          onSubmit={handleSubmit}
        >
          {/* Textarea Container */}
          <div className="flex-1 min-h-[40px] relative">
            <textarea
              ref={textareaRef}
              className="w-full px-2 py-2 resize-none bg-transparent focus:outline-none text-base leading-6 transition-[height] duration-200 ease-in-out overflow-y-auto scrollbar-thin"
              placeholder="متن را بنویسید..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              disabled={sending}
              rows={1}
              style={{ 
                minHeight: "40px",
                maxHeight: "160px"
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pb-1">
            <button
              type="button"
              className="hover:bg-[#EFEFEF] p-1.5 rounded-full transition-colors"
              aria-label="Clipboard"
            >
              <ClipboardList size={20} className="text-[#3F3F3F]" />
            </button>

            <button
              type="button"
              className="hover:bg-[#EFEFEF] p-1.5 rounded-full transition-colors"
              aria-label="Add attachment"
            >
              <Plus size={20} className="text-[#3F3F3F]" />
            </button>

            <button
              className="rounded-full p-2 bg-[#D2D2D3] hover:bg-[#EFEFEF] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
            >
              <ArrowUp size={20} className="text-[#3F3F3F]" />
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