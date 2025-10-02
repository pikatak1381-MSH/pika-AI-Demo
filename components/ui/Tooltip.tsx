"use client"

import * as RadixTooltip from "@radix-ui/react-tooltip"
import { ReactNode } from "react"
import Image from "next/image"

interface TooltipProps {
  children: ReactNode
  content: ReactNode
  imageSrc?: string
  imageDescription?: string
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delayDuration?: number
  disabled?: boolean
}

export function Tooltip({
  children,
  content,
  imageSrc,
  imageDescription,
  side = "top",
  align = "center",
  delayDuration = 50,
  disabled = false,
}: TooltipProps) {
  if (disabled) return <>{children}</>

  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            className={`
              flex items-center justify-center rounded-2xl bg-black px-2 py-1 text-xs text-white shadow-xl border border-[#C8C8C8] animate-fade-in will-change-[transform,opacity] transition-all duration-200 ease-out z-50 
              data-[state=delayed-open]:opacity-100
              data-[state=closed]:opacity-0
              data-[state=delayed-open]:scale-100
              data-[state=closed]:scale-95
              data-[side=top]:animate-slide-up
              data-[side=bottom]:animate-slide-down
              data-[side=left]:animate-slide-left
              data-[side=right]:animate-slide-right
            `}
          >
            <div
              className="flex items-center gap-2"
            >
              {imageSrc && (
                <Image
                  className="w-10 h-auto object-cover rounded-full"
                  src={imageSrc}
                  alt={imageDescription || ""}
                  width={40}
                  height={40}
                />
              )}
              {content}
            </div>
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
