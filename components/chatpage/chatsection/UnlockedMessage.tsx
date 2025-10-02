"use client"

import { useState } from "react"
import { ChatbotResponse } from "@/lib/types"
import { useInvoiceStore } from "@/stores/useInvoiceStore"
import OfferItem from "./OfferItem"
import SendAction from "./SendAction"
import InvoiceModal from "@/components/invoice/InvoiceModal"
import FeedbackBox from "./FeedbackBox"
import { motion } from "framer-motion"
import AnimatedContainer from "@/components/ui/AnimatedContainer"
import ResponseSkeleton from "@/components/ui/skeletons/ResponseSkeleton"

interface UnlockedMessageProps {
  response: ChatbotResponse
  messageId: number | string
}

const UnlockedMessage: React.FC<UnlockedMessageProps> = ({ response, messageId }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { selectedProducts } = useInvoiceStore()

  const handleSend = () => {
    if (selectedProducts.length === 0) {
      setError("حداقل یک محصول را انتخاب کنید!")
      return
    }

    setError(null)
    setIsInvoiceModalOpen(true)
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
      {response.offered_product_answer.length > 0 && (
        <>
          <motion.div
            className="relative w-full my-4 p-3 border-y-2 border-gray-200"
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
                  className="font-semibold text-sm mb-2 text-black/70"
                >
                  {product.category}
                </h3>

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
            ))}

            <SendAction 
              onSend={handleSend}
              error={error}
            />

            <InvoiceModal 
              onClose={() => setIsInvoiceModalOpen(false)}
              isInvoiceModalOpen={isInvoiceModalOpen}
              messageId={messageId}
              response={response}
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