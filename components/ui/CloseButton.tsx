"use client"

import Image from "next/image"
import clsx from "clsx"
import { motion, HTMLMotionProps } from "framer-motion"

const CloseButton: React.FC<HTMLMotionProps<"button">> = ({ className, ...props }) => {
    const baseStyle = "p-1 m-1 hover:shadow-sm rounded-full"

    return (
        <motion.button
            className={clsx(baseStyle, className)}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            <Image
                className="w-6 h-6 object-cover"
                src="/icons/black-close-icon.svg"
                alt=""
                width={24}
                height={24}
            />
        </motion.button>
  )
}

export default CloseButton