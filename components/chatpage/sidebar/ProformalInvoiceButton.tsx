import { Tooltip } from "@/components/ui/Tooltip"
import { ScrollText } from "lucide-react"

interface ProformalInvoiceButtonProps {
    children: React.ReactNode
    isSidebarOpen: boolean
}

const ProformalInvoiceButton: React.FC<ProformalInvoiceButtonProps> = ({ children, isSidebarOpen }) => {

  return (
    <Tooltip
      content="پیش فاکتور"
      side={isSidebarOpen ? "bottom" : "left"}
      disabled={isSidebarOpen}
    >
      <button
        className="w-full flex items-center gap-3 p-1 text-sm rounded-lg hover:bg-[#EFEFEF] transition-colors disabled:cursor-not-allowed"
      >
        <ScrollText size={20} />
        {children}
      </button>
    </Tooltip>
  )
}

export default ProformalInvoiceButton