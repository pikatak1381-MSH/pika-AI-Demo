import Image from "next/image"
import FeedbackButton from "@/components/ui/FeedbackButton"

interface FeedbackBoxProps {
    className?: string
}

const FeedbackBox: React.FC<FeedbackBoxProps> = ({ className }) => {
  return (
    <div
        className={`${className || ""} flex items-center gap-4 mb-4`}
    >
        {/* Like */}
        <FeedbackButton
            type="button"
        >
            <Image
                className="w-5 h-5"
                src="/icons/like-icon.svg"
                alt=""
                width={20}
                height={20}
            />
        </FeedbackButton>

        {/* Dislike */}
        <FeedbackButton>
            <Image
                className="w-5 h-5"
                src="/icons/dislike-icon.svg"
                alt=""
                width={20}
                height={20}
            />
        </FeedbackButton>

        {/* Share */}
        {/* <FeedbackButton>
            <Image
                className="w-5 h-5"
                src="/icons/link-icon.svg"
                alt=""
                width={20}
                height={20}
            />
        </FeedbackButton> */}

        {/* Cancel */}
        <FeedbackButton>
            <Image
                className="w-5 h-5"
                src="/icons/black-close-icon.svg"
                alt=""
                width={20}
                height={20}
            />
        </FeedbackButton>
    </div>
  )
}

export default FeedbackBox