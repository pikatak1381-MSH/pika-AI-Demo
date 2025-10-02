"use client"

import { motion, HTMLMotionProps, TargetAndTransition } from "framer-motion"
import clsx from "clsx"

type AnimationVariant = "fade" | "slideDown" | "slideUp" | "slideLeft" | "slideRight" | "zoom"

interface AnimationVariantProps extends HTMLMotionProps<"div"> {
    variant?: AnimationVariant
    delay?: number
    duration?: number
    as?: keyof typeof motion
}

export const AnimatedContainer: React.FC<AnimationVariantProps> = ({ 
  children, 
  className, 
  variant = "fade",
  delay = 0, 
  duration = 0.3,
  as = "div",
  ...props }) => {

  const MotionTag = motion[as] as typeof motion.div

  const variants: Record<AnimationVariant, { initial: TargetAndTransition; animate: TargetAndTransition, exit?: TargetAndTransition }> = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideDown: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0  },
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
    },
  }

  return (
    <MotionTag
        initial={variants[variant].initial}
        animate={variants[variant].animate}
        transition={{ delay, duration, ease: "easeInOut" }}
        className={clsx(className)}
        {...props}
    >
        {children}
    </MotionTag>
  )
}

export default AnimatedContainer