"use client"

import clsx from "clsx"
import { motion, HTMLMotionProps } from "framer-motion"

type FeedbackButtonVariant = "initial" | "done"

interface FeedbackBoxProps extends HTMLMotionProps<"button"> {
    variant?: FeedbackButtonVariant
}

const FeedbackButton: React.FC<FeedbackBoxProps> = ({ variant = "initial", className, children, ...props }) => {
    const baseStyle = "p-1 cursor-pointer hover:shadow transition-all border border-transparent rounded-xl duration-200 text-nowrap"

    const variantStyles: Record<FeedbackButtonVariant, string> = {
        initial: "bg-white",
        done: "bg-gray-400"
    }

  return (
        <motion.button
            className={clsx(baseStyle, variantStyles[variant], className)}
            {...props}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
  )
}

export default FeedbackButton