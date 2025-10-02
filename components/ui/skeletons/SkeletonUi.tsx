import AnimatedContainer from "../AnimatedContainer"
import ChatMessageSkeleton from "./ChatMessageSkeleton"
import SidebarSkeleton from "./SidebarSkeleton"


const SkeletonUi = () => {
  return (
    <div
        className="w-screen h-screen flex overflow-hidden"
    >
      <AnimatedContainer variant="fade" className="w-full h-full flex">
        <SidebarSkeleton />
        <ChatMessageSkeleton />
      </AnimatedContainer>
    </div>
  )
}

export default SkeletonUi