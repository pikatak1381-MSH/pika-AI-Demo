"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ProductSpecifications } from "@/lib/types"

interface OfferDetailsProps {
  detailsOpen: boolean
  specifications: ProductSpecifications[]
}

const OfferDetails: React.FC<OfferDetailsProps> = ({ detailsOpen, specifications }) => {
  return (
    <div
      className="space-y-1 mb-2 bg-gray-100 rounded-md"
    >
      <AnimatePresence
        initial={false}
      >
        {detailsOpen && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 pr-4 py-2 space-y-1 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {specifications.map((spec, index) => (
              <div
                className="py-1 flex justify-start items-center gap-2"
                key={index}
              >
                <span
                  className="text-black font-semibold text-xs"
                >
                  {spec.AttributeName}:
                </span>
                <span
                  className="text-zinc-600 text-xs"
                >
                  {spec.Value}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default OfferDetails