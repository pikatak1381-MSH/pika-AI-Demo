"use client"

import { AnimatePresence, motion } from "framer-motion"
import { profileModalBtns } from "@/data/statics"
import Image from "next/image"
import { useAuth } from "@/hooks/auth/useAuth"
import { useAuthStore } from "@/stores/useAuthStore"

interface ProfileModalProps {
    forwardedRef: React.RefObject<HTMLDivElement | null>
    isModalOpen: boolean
}

const ProfileModal: React.FC<ProfileModalProps> = ({ forwardedRef, isModalOpen }) => {
    const { logout } = useAuth()
    const { email } = useAuthStore()

    return (
        <AnimatePresence>
            {isModalOpen && (
                <motion.div
                    className="fixed flex flex-col right-0 bottom-5 mt-2 py-3 px-4 space-y-2 border border-[#939393] rounded-2xl bg-white shadow-[5px_5px_10px_5px_#0000000D] z-50"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    ref={forwardedRef}
                >
                    <span
                        className="w-full flex items-center rounded-lg py-1 pl-8 pr-1 gap-2 text-xs font-medium hover:drop-shadow-2xl hover:shadow-inner hover:bg-white/80 transition-colors"
                    >
                        <Image 
                            src="/icons/user-icon.svg"
                            alt=""
                            width={24}
                            height={24}
                        />
                        {email}
                    </span>
                    <hr className="w-full border-t-[#939393]/37 border-t-2"/>
                    <button
                        className="w-full flex items-center rounded-lg py-1 pl-8 pr-1 gap-2 text-xs font-medium hover:drop-shadow-2xl hover:shadow-inner hover:bg-white/80 transition-colors"
                    >
                        <Image 
                            src={profileModalBtns[0].icon}
                            alt=""
                            width={24}
                            height={24}
                        />
                        {profileModalBtns[0].text}
                    </button>

                    <button
                        className="w-full flex items-center rounded-lg py-1 pl-8 pr-1 gap-2 text-xs font-medium hover:drop-shadow-2xl hover:shadow-inner hover:bg-white/80 transition-colors"
                    >
                        <Image 
                            src={profileModalBtns[1].icon}
                            alt=""
                            width={24}
                            height={24}
                        />
                        {profileModalBtns[1].text}
                    </button>

                    <button
                        className="w-full flex items-center rounded-lg py-1 pl-8 pr-1 gap-2 text-xs font-medium hover:drop-shadow-2xl hover:shadow-inner hover:bg-white/80 transition-colors"
                    >
                        <Image 
                            src={profileModalBtns[2].icon}
                            alt=""
                            width={24}
                            height={24}
                        />
                        {profileModalBtns[2].text}
                    </button>
                    <hr className="w-full border-t-[#939393]/37 border-t-2"/>
                    <button
                        className="w-full flex items-center rounded-lg py-1 pl-8 pr-1 gap-2 text-xs font-medium hover:drop-shadow-2xl hover:shadow-inner hover:bg-white/80 transition-colors"
                    >
                        <Image 
                            src={profileModalBtns[3].icon}
                            alt=""
                            width={24}
                            height={24}
                        />
                        {profileModalBtns[3].text}
                    </button>

                    <button
                        className="w-full flex items-center rounded-lg py-1 pl-8 pr-1 gap-2 text-xs font-medium hover:drop-shadow-2xl hover:shadow-inner hover:bg-white/80 transition-colors"
                        onClick={() => logout()}
                    >
                        <Image 
                            src={profileModalBtns[4].icon}
                            alt=""
                            width={24}
                            height={24}
                        />
                        {profileModalBtns[4].text}
                    </button>
                </motion.div>     
            )}
        </AnimatePresence>
    )
}

export default ProfileModal