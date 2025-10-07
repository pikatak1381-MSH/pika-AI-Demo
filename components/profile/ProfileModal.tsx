"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "@/hooks/auth/useAuth"
import { useAuthUser } from "@/stores/useAuthStore"
import { useModalStore } from "@/stores/useModalStore"
import { Settings, CircleUserRound, Sparkle, LogOut } from "lucide-react"
import { Dialog } from "../ui/dialog"
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog"

interface ProfileModalProps {
    isOpen: boolean
    onClose: () => void
}


const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const { openSettings } = useModalStore()
    const { logout } = useAuth()
    const user = useAuthUser()

    const iconSizes = 20

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <AnimatePresence>
                {isOpen && (
                    <DialogContent>
                        <DialogTitle className="sr-only">اطلاعات پروفایل</DialogTitle>
                        <motion.div
                            className="fixed flex flex-col right-0 bottom-10 mt-2 p-6 space-y-2 rounded-2xl bg-white shadow-sm z-50"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <p
                                className="w-full flex items-center rounded-lg p-1 gap-2"
                            >
                                <CircleUserRound size={iconSizes} />
                                <span className="text-gray-500 text-sm">{user?.email}</span>
                            </p>

                            <button
                                className="w-full flex items-center rounded-lg p-1 gap-2 text-sm hover:bg-gray-200 transition-colors"
                            >
                                <Sparkle size={iconSizes}/>
                                خرید بسته
                            </button>

                            <button
                                className="w-full flex items-center rounded-lg p-1 gap-2 text-sm hover:bg-gray-200 transition-colors"
                                onClick={() => openSettings()}
                            >
                                <Settings size={iconSizes} />
                                تنظیمات
                            </button>

                            <hr className="w-full border-t-[#939393]/37 border-t-1"/>

                            <button
                                className="w-full flex items-center rounded-lg p-1 gap-2 text-sm hover:bg-gray-200 transition-colors"
                                onClick={() => logout()}
                            >
                                <LogOut size={iconSizes} />
                                خروج
                            </button>
                        </motion.div>   
                    </DialogContent>
                )}
            </AnimatePresence>
        </Dialog>

    )
}

export default ProfileModal