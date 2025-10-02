"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import Image from "next/image"

interface CopyButtonProps {
    message: string
    index: number
}


const CopyButton: React.FC<CopyButtonProps> = ({ message, index }) => {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    const handleCopy = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedIndex(index)
            setTimeout(() => {
                setCopiedIndex(null)
        }, 2000)
        } catch (error) {
            console.error("Failed to copy", error)
        }
  }
  return (
    <AnimatePresence>
        <motion.button
            className="absolute -bottom-8 left-0 items-center gap-1 mb-1 rounded-lg hover:shadow-lg hover:p-1 transition-all cursor-pointer z-20"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => handleCopy(message, index)}
        >
        {copiedIndex === index ? (
            <>
                <Image 
                    src="/icons/check-icon.svg"
                    alt="copy icon"
                    width={24}
                    height={24}
                />
            </>
        ) : (
            <>
                <Image 
                    src="/icons/copy-icon.svg"
                    alt="check icon"
                    width={24}
                    height={24}
                />
            </>
        )}
        </motion.button>
    </AnimatePresence>
  )
}

export default CopyButton