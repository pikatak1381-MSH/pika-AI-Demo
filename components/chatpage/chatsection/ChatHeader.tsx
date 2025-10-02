import AnimatedContainer from "../../ui/AnimatedContainer"
import AiVersionSelector from "./AiVersionSelector"


const ChatHeader = () => {
  return (
    <header
      className="sticky top-0 left-0 w-full bg-[#f9f9f9] z-20"
    >
      <AnimatedContainer
        className="flex justify-between items-center w-full mx-auto px-4 py-1 z-10"
        variant="slideUp"
        delay={0.8}
      >
        <AiVersionSelector />
      </AnimatedContainer>
    </header>
  )
}

export default ChatHeader