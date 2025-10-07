"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Copy, CopyCheck } from "lucide-react"

interface CopyButtonProps {
    message: string
    index: number
}

const CopyButton: React.FC<CopyButtonProps> = ({ message }) => {
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setIsCopied(true)
            setTimeout(() => {
                setIsCopied(false)
            }, 2000)
        } catch (error) {
            console.error("Failed to copy", error)
        }
    }

  return (
    <motion.button
        className="absolute -bottom-8 left-0 items-center gap-1 mb-1 rounded-lg hover:shadow-md hover:p-0.5 transition-all cursor-pointer z-20"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={() => handleCopy(message)}
    >
        <AnimatePresence mode="wait">
            {isCopied ? (
                <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                >
                    <CopyCheck size={22}/>
                </motion.div>
            ) : (
                <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                >
                    <Copy size={22}/>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.button>
  )
}

export default CopyButton