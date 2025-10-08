"use client"

import { useState } from "react"
import { ChatbotResponse } from "@/lib/types"
import { useInvoiceStore } from "@/stores/useInvoiceStore"
import OfferItem from "./OfferItem"
import SendAction from "./SendAction"
import FeedbackBox from "./FeedbackBox"
import { motion } from "framer-motion"
import AnimatedContainer from "@/components/ui/AnimatedContainer"
import ResponseSkeleton from "@/components/ui/skeletons/ResponseSkeleton"
import { useModalStore } from "@/stores/useModalStore"

interface UnlockedMessageProps {
  response: ChatbotResponse
  messageId: number | string
}

const UnlockedMessage: React.FC<UnlockedMessageProps> = ({ response, messageId }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { selectedProducts } = useInvoiceStore()
  const { openInvoice } = useModalStore()

  const handleSend = () => {
    if (selectedProducts.length === 0) {
      setError("حداقل یک محصول را انتخاب کنید!")
      return
    }

    setError(null)

    openInvoice({
      response,
      error,
      messageId
    })
  }


  if (!response || response.offered_product_answer.length === 0) {
    return (
      <ResponseSkeleton />
    )    
  }

  return (
    <>
      {/* Intro with Typewriter effect */}
      {response.intro_answer && (
        <AnimatedContainer
          variant="fade"
        >
          <p>{response.intro_answer}</p>
        </AnimatedContainer>
      )}

      {/* Offers only appearing after typing is done */}
      {response.offered_product_answer.length === 0 ? (
        <div
          className="w-full my-6 py-6 border-y-2 border-gray-200"
        >
          <p
            className="font-medium"
          >
             .متاسفانه محصولی بااین مشخصات یافت نشد
          </p>
        </div>
      ) : (
        <>
          <motion.div
            className="relative w-full my-6 py-6 border-y-2 border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {response.offered_product_answer.map((product) => (
              <div
                className="w-full p-3 rounded-lg"
                key={product.category}
              >
                <h3
                  className="font-semibold text-sm mb-2 text-gray-800"
                >
                  {product.category}
                </h3>

                {/* Products Table */}
                <div
                  className="relative rounded-xl overflow-hidden pb-4"
                >
                  <div
                    className="max-h-96 overflow-y-auto px-2
                      [&::-webkit-scrollbar]:w-1
                      [&::-webkit-scrollbar]:transition-opacity
                      [&::-webkit-scrollbar]:opacity-0
                      [&::-webkit-scrollbar-track]:bg-transparent
                      [&::-webkit-scrollbar-thumb]:bg-gray-700
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb:hover]:bg-gray-800
                      [&::-webkit-scrollbar-thumb:hover]:cursor-pointer
                    "
                  >
                    {product.offers.map((offer, index) => (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.2 }}
                      >
                        <OfferItem 
                          offer={offer}
                          expanded={expandedId === offer.id}
                          onToggle={() =>
                            setExpandedId(expandedId === offer.id ? null : offer.id)
                          }              
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
                </div>

              </div>
            ))}

            <SendAction 
              onSend={handleSend}
              error={error}
            />

          </motion.div>
          <FeedbackBox />        
        </>
      )}
    </>
  )
}

export default UnlockedMessage