"use client"

import { useConversation } from "@/hooks/message/useConversation"
import AnimatedContainer from "@/components/ui/AnimatedContainer"
import { ArrowUp, Plus, ClipboardList } from "lucide-react"

/**
 * Temporary page that shows optimistic UI while waiting for conversation_id
 * The URL will be replaced with /chat/[id] once the backend responds
 */
const NewChatPage = () => {
  const { messages } = useConversation("new")

  return (
    <>
      <div className="w-full flex-1 flex flex-col items-center overflow-y-auto px-4 py-6">
        <AnimatedContainer
            variant="zoom"
            className="relative w-full max-w-4xl self-center p-3 rounded-2xl text-gray-900"
        >
            {messages.map((msg) => (
                <div
                    className="group w-full max-w-4xl flex flex-col relative"
                    key={`${msg.role}-${msg.id}`}
                >
                    {msg.role === "user" && typeof msg.content === "string" && (
                        <div
                            className="w-fit relative my-12"
                        >
                            <p
                                className="rounded-2xl p-3.5 bg-[#E5E5E5] self-start text-pretty"
                            >
                                {msg.content}
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </AnimatedContainer>
      </div>

      <div className="w-full bg-[#f9f9f9] p-4">
        <div className="w-full max-w-3xl flex items-end gap-3 py-2 px-4 border border-[#939393] rounded-4xl bg-[#FBFBFF] shadow-[5px_5px_10px_5px_#0000000D] mx-auto opacity-50 cursor-not-allowed">
          {/* Textarea Container */}
          <div className="flex-1 min-h-[40px] relative">
            <textarea
              className="w-full px-2 py-2 resize-none bg-transparent focus:outline-none text-base leading-6"
              placeholder="در حال ارسال..."
              disabled
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
              className="p-1.5 rounded-full"
              disabled
              aria-label="Clipboard"
            >
              <ClipboardList size={20} className="text-[#3F3F3F]" />
            </button>

            <button
              type="button"
              className="p-1.5 rounded-full"
              disabled
              aria-label="Add attachment"
            >
              <Plus size={20} className="text-[#3F3F3F]" />
            </button>

            <button
              className="rounded-full p-2 bg-[#D2D2D3]"
              disabled
              aria-label="Send message"
            >
              <ArrowUp size={20} className="text-[#3F3F3F]" />
            </button>
          </div>
        </div>
        
        <p className="text-center mt-2 text-xs md:text-sm text-[#797979]">
          هوش مصنوعی پیکاتک ممکن است اشتباه کند. اطلاعات مهم را حتماً بررسی کنید.
        </p>
      </div>
    </>
  )
}

export default NewChatPage