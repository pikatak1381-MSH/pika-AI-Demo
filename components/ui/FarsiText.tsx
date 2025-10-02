"use client"

import { ReactNode } from "react"
import { useFarsiNumbers } from "@/hooks/useFarsiNumbers"

export default function FarsiText({ children }: { children: ReactNode }) {
  return <>{useFarsiNumbers(children)}</>
}
