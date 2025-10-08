"use client"

import { ChatbotResponse, ChatMessageType } from "@/lib/types"
import { useEffect, useRef, useMemo } from "react"
import CopyButton from "./CopyButton"
import ChatMessage from "./ChatMessage"
import AnimatedContainer from "../../ui/AnimatedContainer"

interface ChatWindowProps {
  messages: ChatMessageType[]
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  /* Memoizing the rendered messages to prevent flashing */
  const renderedMessages = useMemo(() => {
   return messages.map((msg) => (
    <div
      key={`${msg.role}-${msg.id}`}
      className="group w-full max-w-4xl flex flex-col relative"
    >
      {msg.role === "user" && typeof msg.content === "string" ? (
        <div
          className="w-fit relative my-12"
        >
          <p
            className="rounded-2xl px-4 py-3 bg-[#E5E5E5] self-start text-pretty"
          >
            {msg.content}
          </p>
          <CopyButton 
            message={msg.content}
            index={Number(msg.id)}
            aria-label="Copy Button"
          />
        </div>
      ) : msg.role === "ai" ? (
        <ChatMessage 
          response={msg.content as ChatbotResponse}
          isLocked={msg.is_locked}
          messageId={msg.id}
          selectedProductsSnapshot={msg.selectedProducts}
        />        
      ) : (
        <div className="my-4 text-sm text-gray-500 italic border border-dashed">
          {msg.content}
        </div>        
      )}
    </div>
   ))
  }, [messages])
  
  const endRef = useRef<HTMLDivElement | null>(null)

  /* Scrolling to the end of the conversation */
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <AnimatedContainer
      variant="fade"
      className="relative w-full max-w-4xl self-center rounded-2xl text-gray-900"
    >
      {renderedMessages}
      
      <div ref={endRef}/>
    </AnimatedContainer>
  )
}

export default ChatWindow