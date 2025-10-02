"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock } from "lucide-react"
import Image from "next/image"
import { ChatbotResponse } from "@/lib/types"

interface LockedMessageProps {
  selectedProducts?: ChatbotResponse["offered_product_answer"][number]["offers"]
}


const LockedMessage: React.FC<LockedMessageProps> = ({ selectedProducts }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div
      className="relative my-4 p-3 bg-gray-50 border-gray-200 rounded-2xl shadow-sm"
    >
      {selectedProducts && (
        <div
          className="space-y-4"
        >
          <h4
            className="text-center font-bold text-blue-500"
          >
            محصولات انتخاب شده
          </h4>

          {selectedProducts.map((offer) => (
            <div
              className="flex flex-col space-y-2"
              key={offer.id}
            >
              <div
                className="flex gap-4"
              >
                <ul
                  className="flex items-center gap-2 p-2 pr-6 rounded-lg bg-gray-100"
                >
                  <li
                    className="list-dics text-md font-semibold leading-loose"
                  >
                    {offer.name}
                  </li>
                </ul>

                <button
                  className={`flex gap-2 items-center text-xs px-2 py-1 rounded-lg ${
                    expandedId === offer.id
                      ? "bg-red-100 text-black hover:bg-red-300"
                      : "text-blue-500 hover:bg-blue-100"
                  } transition-colors`}
                  onClick={() => setExpandedId(expandedId === offer.id ? null : offer.id)}
                >
                  <Image
                    className="w-3 h-3"
                    src={expandedId === offer.id ? "/icons/black-close-icon.svg" : "/icons/blue-arrow-icon.svg"}
                    alt=""
                    width={12}
                    height={12}
                  />
                  {expandedId === offer.id ? "بستن جزئیات" : "نمایش جزئیات"}
                </button>
              </div>

              <div
                className="space-y-1 mb-2 bg-gray-100 rounded-md"
              >
                <AnimatePresence
                  initial={false}
                >
                  {expandedId === offer.id && (
                    <motion.div
                      className="flex flex-col pr-4 space-y-1 text-sm overflow-hidden"
                      key={offer.id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {offer.specifications.map((spec, index) => (
                        <div
                          className="py-1 flex justify-start items-center gap-2"
                          key={index}
                        >
                          <span
                            className="text-black font-semibold"
                          >
                            {spec.AttributeName}:
                          </span>
                          <span
                            className="text-zinc-600"
                          >
                            {spec.Value}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className="flex items-center gap-2 mt-2"
      >
        <Lock className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600">این پیام قفل شده است</span>
      </div>
    </div>
  )
}

export default LockedMessage