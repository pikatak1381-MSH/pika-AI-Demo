"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/hooks/auth/useAuth"
import { useConversation1 } from "@/hooks/message/useConversation1"
import AnimatedContainer from "@/components/ui/AnimatedContainer"
import ShortCutButtons from "@/components/chatpage/chatsection/ShortCutButtons"
import SkeletonUi from "@/components/ui/skeletons/SkeletonUi"
import { ArrowUp, Plus, ClipboardList } from "lucide-react"

const WelcomeChatPage = () => {
    const { createNewConversation, sending } = useConversation1()
    const { isReady } = useAuth()
    const [input, setInput] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    if (!isReady) {
        return <SkeletonUi />
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const message = input.trim()
        if (!message || isCreating) return

        setIsCreating(true)
        
        try {
            // Clear input immediately for better UX
            setInput("")
            if (textareaRef.current) {
                textareaRef.current.style.height = "40px"
            }

            // Create conversation with initial message
            // The message will be sent after navigation
            await createNewConversation({
                autoRedirect: true,
                initialMessage: message,
            })
        } catch (error) {
            console.error("Failed to create conversation:", error)
            alert("مشکلی بوجود آمد، لطفا دوباره تلاش کنید.")
            // Restore input on error
            setInput(message)
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="w-full flex-1 flex flex-col justify-center items-center px-4">
            <AnimatedContainer
                className="w-full flex flex-col items-center justify-center"
                variant="zoom"
                delay={0.5}
            >
                <p className="text-2xl font-bold text-center my-4">
                    چطور می‌توانم به شما کمک کنم؟
                </p>

                <form
                    className="w-full max-w-3xl flex items-center justify-between p-1.5 border border-[#939393] rounded-4xl bg-[#FBFBFF] shadow-[5px_5px_10px_5px_#0000000D] hover:bg-[#E0E0E0] transition-colors duration-700 mx-auto z-20 overflow-hidden"
                    onSubmit={handleSubmit}
                >
                    {/* Input */}
                    <div className="relative w-full">
                        <textarea
                            className="peer w-full p-2 resize-none placeholder-transparent focus-visible:outline-none overflow-y-auto"
                            ref={textareaRef}
                            placeholder="متن را بنویسید..."
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value)
                                e.target.style.height = "auto"
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSubmit(e)
                                }
                            }}
                            rows={1}
                            disabled={isCreating}
                        />
                        <span className="w-full pointer-events-none absolute inset-0 flex items-center justify-start text-gray-400 peer-focus:hidden peer-not-placeholder-shown:hidden">
                            متن را بنویسید...
                        </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-4 h-full">
                        <button 
                            type="button"
                            className="hover:bg-[#EFEFEF] p-1 rounded-full transition-colors"
                        >
                            <ClipboardList size={22} />
                        </button>
                        <button 
                            type="button"
                            className="hover:bg-[#EFEFEF] p-1 rounded-full transition-colors"
                        >
                            <Plus size={22} />
                        </button>
                        <button
                            className="mr-1 rounded-full p-2 bg-[#D2D2D3] hover:bg-[#EFEFEF] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            type="submit"
                            disabled={sending || isCreating || !input.trim()}
                        >
                            <ArrowUp size={24} className="text-[#3F3F3F]" />
                        </button>
                    </div>
                </form>

                <ShortCutButtons />
            </AnimatedContainer>
        </div>
    )
}

export default WelcomeChatPage