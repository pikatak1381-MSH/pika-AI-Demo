"use client"

import { motion, AnimatePresence, type Transition } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import AnimatedContainer from "@/components/ui/AnimatedContainer"
import NewConversationButton from "./NewConversationButton"
import ProfileButton from "./ProfileButton"
import TokenBox from "./TokenBox"
import SidebarHeader from "./SidebarHeader"
import SearchButton from "./SearchButton"
import ProformalInvoiceButton from "./ProformalInvoiceButton"
import ProfileModal from "./ProfileModal"
import { SidebarChatHistory } from "./SidebarChatHistory"

const transition: Transition = { type: "spring", stiffness: 300, damping: 30 }


const Sidebar = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
    const profileModalRef = useRef<HTMLDivElement>(null)

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev)
    }

    const toggleProfileModal = () => {
        setIsModalOpen(prev => !prev)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileModalRef.current &&
                !profileModalRef.current.contains(event.target as Node)
            ) {
                setIsModalOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <motion.aside
            className={`relative w-full flex flex-col border-l border-[#EDEDED] bg-white h-full space-y-4 ${!sidebarOpen && "cursor-e-resize items-center"}`}
            initial={{ opacity: 0, width: 50 }}
            animate={{ 
                width: sidebarOpen ? 280 : 50,
                padding: sidebarOpen ? "0.25rem 1rem" : "1rem 0.5rem",
                opacity: 1
            }}
            transition={transition}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top Section: Header + Buttons */}
            <div
                className={`flex flex-col space-y-2 flex-shrink-0 ${!sidebarOpen && "cursor-e-resize items-center"}`}
            >
                <SidebarHeader 
                    sidebarOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    isHovered={isHovered}
                    transition={transition}
                />
 
                <NewConversationButton
                    isSidebarOpen={sidebarOpen}
                >
                    {sidebarOpen && <AnimatedContainer variant="fade" as="span">گفت‌و‌گو جدید</AnimatedContainer>}
                </NewConversationButton>

                <SearchButton
                    isSidebarOpen={sidebarOpen}
                >
                    {sidebarOpen && <AnimatedContainer variant="fade" as="span">جستجو</AnimatedContainer>}
                </SearchButton>

                <ProformalInvoiceButton
                    isSidebarOpen={sidebarOpen}
                >
                    {sidebarOpen && <AnimatedContainer variant="fade" as="span">پیکاتک</AnimatedContainer>}
                </ProformalInvoiceButton>
            </div>

            {/* Scrollabale Section: Chat History */}
            {sidebarOpen && (
                <div
                    className="flex-1 flex flex-col min-h-0 my-2 py-2 border-t border-gray-300"
                >
                    <h4
                        className="text-sm font-medium mb-4 px-1"
                    >
                        گفت‌و‌گوها
                    </h4>
                    <div
                        className="flex-1 min-h-0 overflow-hidden"
                    >
                        <SidebarChatHistory />
                    </div>
                </div>
            )}

            {/* Bottom Section: Profile + Token */}
            <div
                className="flex items-center justify-between hover:bg-[#EFEFEF] p-1 rounded-lg cursor-pointer mt-auto z-50 flex-shrink-0"
                onClick={() => toggleProfileModal()}
            >
                <ProfileButton
                    sidebarOpen={sidebarOpen}
                />

                {sidebarOpen && (
                    <TokenBox />
                )}

                <AnimatePresence>
                        <ProfileModal 
                            forwardedRef={profileModalRef}
                            isModalOpen={isModalOpen}
                        />
                </AnimatePresence>

            </div>
        </motion.aside>
    )
}

export default Sidebar