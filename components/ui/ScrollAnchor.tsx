"use client"

import { useEffect, useRef } from "react"

export default function ScrollAnchor({ dependency }: { dependency?: number }) {
  const anchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [dependency])

  return <div ref={anchorRef} />
}
