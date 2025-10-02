import { FC, InputHTMLAttributes, useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Tooltip } from "./Tooltip"

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  children: React.ReactNode
}

const Checkbox: FC<CheckboxProps> = ({ label, className, children, ...props }) => {
  const [isClipped, setIsClipped] = useState<boolean>(false)

  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = spanRef.current
    if (el) setIsClipped(el.scrollWidth > el.clientWidth)
  }, [label])

  return (
    <label 
        className="relative flex items-center gap-2 cursor-pointer select-none w-96"
    >
    <span
        className="relative inline-flex h-3.5 w-3.5"
    >
      <input
        type="checkbox"
        className={cn(
        "peer h-3.5 w-3.5 shrink-0 appearance-none rounded border border-gray-300 bg-white",
        "checked:border-blue-500 checked:bg-blue-500",
        "hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100",
        "transition-colors disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
        className
        )}
        {...props}
      />
      {/* Check icon */}
      <svg
          className="pointer-events-none absolute inset-0 m-auto hidden h-3 w-3 text-white peer-checked:block"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>

    {children}
      
    {isClipped ? (
      <Tooltip
        content={label}
      >
        <span ref={spanRef} className="text-black text-sm truncate block">
          {label}
        </span>
      </Tooltip>
    ) : (
        <span ref={spanRef} className="text-black text-sm truncate block">
          {label}
        </span>
    )}
    </label>
  )
}

export default Checkbox
