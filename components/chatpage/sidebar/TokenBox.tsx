"use client"

import { Sparkle } from "lucide-react"
import { useState } from "react"


const TokenBox = () => {
    const [tokenLeft] = useState<number>(800)

  return (
    <div
      className="flex items-center gap-1"
    >
      {tokenLeft} <Sparkle size={22}/>
    </div>
  )
}

export default TokenBox