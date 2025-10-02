"use client"

import { motion, type Transition } from "framer-motion"
import Image from "next/image"
import { Tooltip } from "@/components/ui/Tooltip"
import { PanelRight } from "lucide-react"

interface SidebarHeaderProps {
  sidebarOpen: boolean
  toggleSidebar: () => void
  isHovered: boolean
  transition: Transition
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ sidebarOpen, toggleSidebar, isHovered, transition }) => {
    return (
        <div
            className="w-full flex items-center mb-8"
        >
            {sidebarOpen ? (
                <div
                    className="w-full flex items-center justify-between"
                >
                    <motion.button
                        className="rounded-lg p-1 hover:bg-[#EFEFEF] transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ...transition, delay: 0.05 }}
                        aria-label="Pika AI Home"
                    >
                        <Image 
                            src="/logos/pika-ai-logo-3x.png"
                            alt="Pika AI Logo"
                            width={26}
                            height={26}
                        />
                    </motion.button>

                    <Tooltip
                        content="بستن منو"
                        side="bottom"
                    >
                        <motion.button
                            className="rounded-lg p-1 cursor-e-resize hover:bg-[#EFEFEF] transition-colors"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ ...transition, delay: 0.1 }}
                            onClick={toggleSidebar}
                        >
                            <motion.div
                            >
                                <PanelRight />
                            </motion.div>
                        </motion.button>
                    </Tooltip>
                </div>
            ) : (
                <Tooltip
                    content="باز کردن منو"
                    side="left"
                >
                        <button
                                className="rounded-lg p-1 hover:bg-[#EFEFEF] cursor-e-resize"
                                onClick={toggleSidebar}
                                aria-label="Open Menu"
                        >
                                {isHovered ? (
                                    <PanelRight />
                                ): (
                                    <div
                                        className="w-6 h-6"
                                    >
                                        <Image
                                            src="/logos/pika-ai-logo-3x.png"
                                            alt="Pika AI Logo"
                                            width={26}
                                            height={26}
                                        />
                                    </div>
                                )}             
                        </button>                        
                </Tooltip>
            )}
        </div>
  )
}

export default SidebarHeader