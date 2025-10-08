"use client"

import { ChatbotResponse } from "@/lib/types"
import LockedMessage from "./LockedMessage"
import UnlockedMessage from "./UnlockedMessage"

interface ChatMessageProps {
    response: ChatbotResponse
    isLocked?: boolean
    messageId: number | string
    selectedProductsSnapshot?: ChatbotResponse["offered_product_answer"][number]["offers"]
}


const ChatMessage: React.FC<ChatMessageProps> = ({
    response,
    isLocked,
    messageId,
    selectedProductsSnapshot
}) => {
    if (isLocked) {
        return (
            <LockedMessage 
                selectedProducts={selectedProductsSnapshot}
            />
        )
    }

    return (
        <UnlockedMessage 
            response={response}
            messageId={messageId}
        />
  )
}

export default ChatMessage