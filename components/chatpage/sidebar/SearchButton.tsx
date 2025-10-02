import { Tooltip } from "@/components/ui/Tooltip"
import { Search } from "lucide-react"

interface SearchButtonProps {
    children: React.ReactNode
    isSidebarOpen: boolean
}

const SearchButton: React.FC<SearchButtonProps> = ({ children, isSidebarOpen }) => {

  return (
    <Tooltip
      content="جستجو"
      side={isSidebarOpen ? "bottom" : "left"}
      disabled={isSidebarOpen}
    >
      <button
        className="w-full flex items-center gap-3 p-1 text-sm rounded-lg hover:bg-[#EFEFEF] transition-colors disabled:cursor-not-allowed"
      >
        <Search size={20} />
        {children}
      </button>
    </Tooltip>
  )
}


export default SearchButton