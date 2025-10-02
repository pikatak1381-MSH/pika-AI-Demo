"use client"
import { useAuthStore } from "@/stores/useAuthStore"

interface ProfileBoxProps {
  sidebarOpen: boolean
  toggleModal?: () => void
}


const ProfileButton: React.FC<ProfileBoxProps> = ({ sidebarOpen, toggleModal }) => {
  const { preferredName } = useAuthStore()


  return (
    <>
      <button
        className="flex gap-2 items-center"
        onClick={toggleModal}
      >
        <div
          className="flex items-center justify-center p-1 rounded-full bg-[#80C0FF] text-sm text-white w-8 h-8"
        >
          PA
        </div>

        {sidebarOpen && (
          <div
            className="flex flex-col items-start"
          >
            <span
              className="text-sm text-[#1E1E1E]"
            >
              {preferredName}
            </span>
            
            <span
              className="text-sm text-[#818181]"
            >
              پروفایل
            </span>
          </div>
        )}
      </button>
    </>
  )
}

export default ProfileButton