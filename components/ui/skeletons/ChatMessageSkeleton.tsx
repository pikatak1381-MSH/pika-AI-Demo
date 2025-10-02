import { Skeleton } from "./Skeleton"
import ChatInputSkeleton from "./ChatInputSkeleton"
import ShortCutBtnSkeleton from "./ShortCutBtnSkeleton"


const ChatMessageSkeleton = () => {
  return (
    <Skeleton
      className="w-full relative flex flex-col items-center h-screen bg-[#F9F9F9]"
    >
        <div className="w-full flex-1 flex flex-col justify-center items-center px-4">
          <div className="w-96 h-6 rounded-xl bg-gray-300 my-4"/>
            <ChatInputSkeleton />
            <ShortCutBtnSkeleton />
        </div>
    </Skeleton>
  )
}

export default ChatMessageSkeleton