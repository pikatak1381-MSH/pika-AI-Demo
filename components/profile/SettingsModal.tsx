"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogClose } from "../ui/dialog"
import { Settings, X, Headset, LayoutGrid, UserRoundPlus, CircleUserRound } from "lucide-react"
import SectionGeneral from "./SectionGeneral"
import SectionSupport from "./SectionSupport"
import SectionSavedClients from "./SectionSavedClients"
import SectionSavedSaleAgents from "./SectionSavedSaleAgents"
import SectionOtherProducts from "./SectionOtherProducts"
import SectionAccount from "./SectionAccount"

interface SettingsModalProps  {
  isOpen: boolean
  section?: string
  onClose: () => void
}


export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, section = "عمومی", onClose }) => {
    const sections = [
        { label: "عمومی", icon: <Settings size={20}/> },
        { label: "حساب کاربری", icon: <CircleUserRound size={20}/> },
        { label: "خریداران", icon: <UserRoundPlus size={20}/> },
        { label: "فروشندگان", icon: <UserRoundPlus size={20}/> },
        { label: "پشتیبانی", icon: <Headset size={20}/> },
        { label: "دیگر محصولات", icon: <LayoutGrid size={20}/> },
    ] as const
    const [activeSection, setActiveSection] = useState(section)

    useEffect(() => {
        setActiveSection(section)
    }, [section])

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay Animation */}
                        <DialogOverlay asChild>
                            <motion.div 
                                className="fixed inset-0 bg-black/40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />
                        </DialogOverlay>

                        {/* Content Animation */}
                        <DialogContent
                            className="!w-full !max-w-2xl h-[60vh] p-0 overflow-hidden"
                            showCloseButton={false}
                        >
                            <DialogTitle className="sr-only">تنظیمات</DialogTitle>
                            <motion.div
                                className="bg-background rounded-2xl shadow-lg overflow-hidden flex"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <DialogClose 
                                    className="absolute right-3 top-3 rounded-md p-1 hover:bg-muted"
                                >
                                    <X className="w-5 h-5" />
                                </DialogClose>

                                {/* Sidebar */}
                                <div
                                    className="w-45 border-l p-4 flex flex-col space-y-4 pt-14"
                                >
                                    {sections.map((section) => (
                                        <button
                                            className={`flex items-center gap-2 p-2 text-sm text-right rounded-2xl ${
                                                activeSection === section.label
                                                ? "bg-accent text-accent-foreground"
                                                : "hover:bg-muted"
                                            }`}
                                            key={section.label}
                                            onClick={() => setActiveSection(section.label)}
                                        >
                                            {section.icon}
                                            {section.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Content */}
                                <div
                                    className="flex-1 p-6 overflow-y-auto"
                                >
                                    {activeSection === "عمومی" && <SectionGeneral />}
                                    {activeSection === "حساب کاربری" && <SectionAccount />}
                                    {activeSection === "خریداران" && <SectionSavedClients />}
                                    {activeSection === "فروشندگان" && <SectionSavedSaleAgents />}
                                    {activeSection === "پشتیبانی" && <SectionSupport />}
                                    {activeSection === "دیگر محصولات" && <SectionOtherProducts />}
                                </div>
                            </motion.div>
                        </DialogContent>
                    </>
                )}
            </AnimatePresence>
        </Dialog>
  )
}