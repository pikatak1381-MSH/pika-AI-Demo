"use client"
import { useEffect, useState, useRef } from "react"

interface TypewriterProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export default function Typewriter({ text, speed = 50, onComplete }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!text) return

    setDisplayed("")
    setDone(false)

    let i = 0
    intervalRef.current = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        setDone(true)
        onComplete?.()
      }
    }, speed)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text, speed, onComplete])

  const skipTyping = () => {
    if (!done) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
      setDisplayed(text)
      setDone(true)
      onComplete?.()
    }
  }

  return (
    <p 
      onClick={skipTyping} 
      onMouseEnter={skipTyping} 
      className="cursor-pointer"
      title="Click or hover to skip typing"
    >
      {displayed}
    </p>
  )
}
