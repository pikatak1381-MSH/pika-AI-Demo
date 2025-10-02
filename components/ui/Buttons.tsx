"use client"

import clsx from "clsx"
import { motion, HTMLMotionProps } from "framer-motion"

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost"

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: ButtonVariant
}


const Button: React.FC<ButtonProps> = ({ variant = "primary", className, children, ...props }) => {
    const baseStyle = "px-3 py-2 border border-transparent rounded-xl font-normal text-sm hover:shadow-sm disabled:opacity-50 transition-colors duration-200 cursor-pointer text-nowrap"

    const variantStyles: Record<ButtonVariant, string> = {
        primary: "bg-blue-400 text-white hover:bg-blue-500 hover:border-blue-300",
        secondary: "bg-blue-100 text-blue-600 hover:border-blue-300",
        danger: "bg-red-600 text-white hover:bg-red-700",
        ghost: "bg-transparent text-blue-500 hover:bg-blue-100 border border-transparent hover:border-blue-500",
    }

    return (
        <motion.button
            className={clsx(baseStyle, variantStyles[variant], className)}
            {... props}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    )
}

export default Button
