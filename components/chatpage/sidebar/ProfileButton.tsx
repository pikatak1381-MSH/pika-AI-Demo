"use client"

import { useAuthUser } from "@/stores/useAuthStore"
import { useModalStore } from "@/stores/useModalStore"

interface ProfileBoxProps {
  sidebarOpen: boolean
}


const ProfileButton: React.FC<ProfileBoxProps> = ({ sidebarOpen }) => {
  const user = useAuthUser()
  const { openProfile } = useModalStore()

  return (
    <>
      <button
        className="flex gap-2 items-center"
        onClick={openProfile}
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
              {user?.preferredName}
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