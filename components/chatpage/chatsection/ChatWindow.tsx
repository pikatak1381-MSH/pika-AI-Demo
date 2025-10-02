"use client"

import { ChatbotResponse, ChatMessageType } from "@/lib/types"
import { useEffect, useRef } from "react"
import CopyButton from "./CopyButton"
import ChatMessage from "./ChatMessage"
import AnimatedContainer from "../../ui/AnimatedContainer"

interface ChatWindowProps {
  messages: ChatMessageType[]
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
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
      className={`relative w-full max-w-4xl h-96 self-center p-3 rounded-2xl text-[#202020]`}
    >
      {messages && (
        messages.map((msg) => (
          <div
            key={msg.id}
            className="group w-full max-w-4xl flex flex-col relative"
          >
            {msg.role === "user" && typeof msg.content === "string" ? (
              <div
                className="w-fit relative my-6"
              >
                <p 
                  className="rounded-2xl p-3.5 bg-[#E5E5E5] self-start"
                >
                  {msg.content}
                </p>

                {/* Copy Button */}
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
      )}
      
      <div ref={endRef}/>
    </AnimatedContainer>
  )
}

export default ChatWindow