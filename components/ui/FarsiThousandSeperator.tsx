"use client"

import { toFarsiNumber } from "@/lib/locale"
import { JSX } from "react"

// Format number: add thousand separators + Farsi digits
export const formatFarsiPrice = (value: number | string): string => {
  const formatted = new Intl.NumberFormat("en-US").format(Number(value))
  return toFarsiNumber(formatted)
}

interface FarsiThousandSeperatorProps {
  value: number | string
  as?: "span" | "p" | "div"
  className?: string
}

export default function FarsiThousandSeperator({ value, as = "span", className = "" }: FarsiThousandSeperatorProps) {
  const Component = as as keyof JSX.IntrinsicElements
  return <Component className={className}>{formatFarsiPrice(value)}</Component>
}
