import { Tooltip } from "@/components/ui/Tooltip"
import { SquarePen } from "lucide-react"
import { useNewConversation } from "@/hooks/message/useNewConversation"

interface NewConversationButtonProps {
    children: React.ReactNode
    isSidebarOpen: boolean
}

const NewConversationButton: React.FC<NewConversationButtonProps> = ({ children, isSidebarOpen }) => {
  const { startNewConversation } = useNewConversation()

  return (
    <Tooltip
      content="گفتگوی جدید"
      side={isSidebarOpen ? "bottom" : "left"}
      disabled={isSidebarOpen}
    >
      <button
        className="w-full flex items-center gap-3 p-1 text-sm rounded-lg hover:bg-[#EFEFEF] transition-colors disabled:cursor-not-allowed"
        onClick={() => startNewConversation()}
      >
        <SquarePen size={20} />
        {children}
      </button>
    </Tooltip>
  )
}

export default NewConversationButton