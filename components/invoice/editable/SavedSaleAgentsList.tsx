"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import Image from "next/image"
import { useGetSaleAgents } from "@/hooks/saleAgentHooks/useGetSaleAgents"
import { useDeleteSaleAgent } from "@/hooks/saleAgentHooks/useDeleteSaleAgent"
import { useInvoiceStore } from "@/stores/useInvoiceStore"
import { useFormModeStore } from "@/stores/useFormModeStore"
import { toast } from "sonner"
import { useState, useRef } from "react"
import { SaleAgentInfo } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/stores/useAuthStore"

const SavedSaleAgentsList = () => {
    const [selectedSaleAgent, setSelectedSaleAgent] = useState<SaleAgentInfo | null>(null)
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const { userId } = useAuthStore()
    const setMode = useFormModeStore((state) => state.setMode)
    const { data: saleAgents, isLoading } = useGetSaleAgents(userId)
    const { setSaleAgent } = useInvoiceStore()
    const deleteMutation = useDeleteSaleAgent()



    const handleSelectSaleAgent = (saleAgent: SaleAgentInfo) => {
        setSaleAgent(saleAgent)
        setSelectedSaleAgent(saleAgent)
        setMode("saleAgent", "readOnly")
    }
    
    const handleEditClick = (saleAgent: SaleAgentInfo) => {
        setSaleAgent(saleAgent)
        setMode("saleAgent", "edit")
    }
    
    const handleDeleteClick = (saleAgentId: string) => {
        const selected = saleAgents?.find((s) => s.sale_agent_id === saleAgentId)
    if (!selected) return

    const confirmed = window.confirm(
        `آیا مطمئن هستید که می خواهید ${selected.sale_agent_name} را حذف کنید؟`
    )
    if (!confirmed) return

    deleteMutation.mutate(saleAgentId, {
            onSuccess: () => toast("فروشنده با موفقیت حذف شد."),
            onError: () => toast("حذف با مشکل مواجه شد."),
        })
    }

    if (isLoading) return <div>در حال دریافت اطلاعات...</div>

    return (
        <div
            className="relative w-full"
        >
            <DropdownMenu.Root open={open} onOpenChange={setOpen}>
                {/* Trigger */}
                <DropdownMenu.Trigger asChild>
                    <button 
                        className="w-full flex items-center justify-between rounded-2xl border border-[#C9CBD1] px-6 py-2 text-black cursor-pointer"
                        type="button"
                        ref={triggerRef}
                    >
                        <div 
                            className="w-full flex gap-2 items-center"
                        >
                            <Image src="/icons/user-profile2-icon.svg" alt="" width={24} height={24} />
                            <div>
                                {
                                    selectedSaleAgent?.sale_agent_name || 
                                    <span className="bg-[#EAEAEA] rounded-2xl px-2 py-1">انتخاب نشده</span>
                                } 
                            </div>
                        </div>

                        <Image
                            src={open ? "/icons/black-arrow-up-icon.svg" : "/icons/black-arrow-down-icon.svg"}
                            alt="toggle dropdown"
                            width={24}
                            height={24}
                        />
                    </button>
                </DropdownMenu.Trigger>

                {selectedSaleAgent && (
                    <div 
                        className="absolute left-18 top-1/2 transform -translate-y-1/2 flex pointer-events-auto z-20"
                    >
                        <span className="bg-[#FFDEAF] rounded-2xl px-3 py-1 text-black">فروشنده</span>
                        <button
                            className="border border-transparent px-1 hover:border-gray-500 rounded-md transition z-20"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleEditClick(selectedSaleAgent)
                            }}
                        >
                            <Image
                                className="w-5 h-5 object-cover"
                                src="/icons/edit-light-icon.svg"
                                alt="edit"
                                width={20}
                                height={20}
                            />
                        </button>
                        <button
                            className="border border-transparent px-1 hover:border-gray-500 rounded-md transition z-50"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteClick(selectedSaleAgent.sale_agent_id)
                            }}
                        >
                            <Image
                                className="w-5 h-5 object-cover"
                                src="/icons/trash-light-icon.svg"
                                alt="delete"
                                width={20}
                                height={20}
                            />
                        </button>
                    </div>
                )}

                {/* Dropdown with Motion */}
                <AnimatePresence>
                    {open && (
                        <DropdownMenu.Portal forceMount>
                            <DropdownMenu.Content 
                                asChild 
                                side="bottom" align="end"
                            >
                                <motion.div
                                    style={{ width: "var(--radix-dropdown-menu-trigger-width" }}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="z-50 mt-2 w-full max-h-40 overflow-y-auto rounded-xl bg-gray-100 shadow-lg border border-gray-300"
                                >
                                    {saleAgents?.map((saleAgent) => (
                                        <DropdownMenu.Item
                                            key={saleAgent.sale_agent_id}
                                            className="grid grid-cols-[1fr_auto_auto] items-center gap-2 py-2 px-6 rounded-lg cursor-pointer hover:bg-gray-200 focus:bg-gray-200 outline-none text-sm"
                                            onSelect={() => handleSelectSaleAgent(saleAgent)}
                                        >
                                            <div 
                                                className="flex items-center gap-2"
                                            >
                                                <span 
                                                    className="text-gray-500 text-sm"
                                                >
                                                    {saleAgent.phone_number}
                                                </span>
                                                <button
                                                    className="border border-transparent hover:border-gray-500 rounded-md transition"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleEditClick(saleAgent)
                                                    }}
                                                >
                                                    <Image
                                                        className="w-5 h-5 object-cover"
                                                        src="/icons/edit-light-icon.svg"
                                                        alt="edit"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </button>
                                                <button
                                                    className="border border-transparent hover:border-gray-500 rounded-md transition"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteClick(saleAgent.sale_agent_id)
                                                    }}
                                                >
                                                    <Image
                                                        className="w-5 h-5 object-cover"
                                                        src="/icons/trash-light-icon.svg"
                                                        alt="delete"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </button>
                                            </div>

                                            <div 
                                                className="flex items-center justify-between gap-3"
                                            >
                                                <span>{saleAgent.sale_agent_name}</span>
                                                <Image
                                                    src="/icons/user-profile2-icon.svg"
                                                    alt=""
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                        </DropdownMenu.Item>
                                    ))}
                                </motion.div>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    )}
            </AnimatePresence>
            </DropdownMenu.Root>
        </div>

    )
}

export default SavedSaleAgentsList
