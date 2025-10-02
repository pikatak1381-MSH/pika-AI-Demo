"use client"

import Button from "@/components/ui/Buttons"
import Image from "next/image"

interface SendActionProps {
  onSend: () => void
  error?: string | null
}

const SendAction: React.FC<SendActionProps> = ({ onSend, error }) => {
  return (
    <div
      className="flex flex-col gap-2 mt-2"
    >
      <Button
        className="flex items-center gap-2 w-fit"
        variant="primary"
        onClick={onSend}
      >
        <Image 
          className="w-3 h-auto"
          src="/icons/horizontal-send-icon.svg"
          alt="Send Icon"
          width={15}
          height={12}
        />
        صدور پیش‌فاکتور
      </Button>
      
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}

export default SendAction