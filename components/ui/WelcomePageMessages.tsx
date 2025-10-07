"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

const serviceSlides = [
    { title: "📊 برسی فنی ابزار‌دقیق", textColor: "#00A693"},
    { title: "📃 صدور پیش‌فاکتور", textColor: "#DE27B6"},
    { title: "‍🏭 دستیار‌فنی", textColor: "#00AA6C"},
    { title:  "🌍 قیمت جهانی", textColor: "#F2A65A"},
]

interface WelcomePageMessagesProps {
  intervalTimeout?: number
  minWidth?: string
}


const WelcomePageMessages: React.FC<WelcomePageMessagesProps> = ({ 
    intervalTimeout = 4000,
    minWidth = "200px",
   }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % serviceSlides.length)
    }, intervalTimeout)

    return () => clearInterval(interval)
  }, [intervalTimeout])

  return (
    <div
      className="flex justify-center"
      style={{ minWidth }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          className="inline-block text-start text-lg"
          key={currentSlide}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ color: serviceSlides[currentSlide].textColor }}
          layout
        >
          {serviceSlides[currentSlide].title}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export default WelcomePageMessages