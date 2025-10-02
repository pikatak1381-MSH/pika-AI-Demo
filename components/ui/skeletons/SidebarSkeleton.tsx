import { Skeleton } from "./Skeleton"

const SidebarBtn = () => {
  return (
      <div
        className="w-full h-8 flex items-center gap-2"
      >
        <div className="w-6 h-6 rounded-md bg-gray-200"></div>
        <div className="w-full max-w-32 h-6 bg-gray-300 rounded-xl"></div>
      </div>
  )
}

const SidebarChatHistory = () => {
  return (
    <div className="w-full max-w-33 h-4 rounded-xl bg-gray-300"></div>
  )
}

const SidebarSkeleton = () => {
  return (
    <Skeleton
      className="w-[280px] flex flex-col border-l border-[#EDEDED] items-center bg-white h-full space-y-4 px-4 py-9"
    >
      {/* Sidebar Header */}
      <div
        className="w-full flex items-center justify-between mb-8"
      >
        <div className="w-7 h-7 rounded-md bg-gray-200"></div>
        <div className="w-7 h-7 rounded-md bg-gray-200"></div>
      </div>

      {/* Sidebar Buttons */}
      <div
        className="w-full flex flex-col space-y-2"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <SidebarBtn key={i}/>
        ))}
      </div>

      {/* Sidebar Chat History */}
      <div
        className="w-full flex-1 flex flex-col gap-4 p-1 border-t border-gray-400"
      >
        <div className="w-full max-w-10 h-4 rounded-xl bg-gray-300 mt-2"></div>
        {Array.from({ length: 4 }).map((_, i) => (
          <SidebarChatHistory key={i}/>
        ))}
      </div>

      {/* Profile and Token */}
      <div
        className="w-full flex flex-col gap-6 mt-auto bg-white"
      >
        <div className="w-8 h-8 p-1 bg-gray-300 rounded-md"></div>

        {/* Token Container */}
        <div className="w-full flex items-center justify-center h-17 rounded-xl border border-gray-200 mt-auto">
          <div
            className="w-4/5 h-3 rounded-lg bg-gray-300 mt-2 overflow-hidden"
          >
          </div>
        </div>
      </div>
    </Skeleton>
  )
}

export default SidebarSkeleton