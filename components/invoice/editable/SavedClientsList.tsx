"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import Image from "next/image"
import FarsiText from "@/components/ui/FarsiText"
import { useGetClients } from "@/hooks/clientHooks/useGetClients"
import { useDeleteClient } from "@/hooks/clientHooks/useDeleteClient"
import { useInvoiceStore } from "@/stores/useInvoiceStore"
import { useFormModeStore } from "@/stores/useFormModeStore"
import { toast } from "sonner"
import { useState, useRef } from "react"
import { ClientInfo } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthUser } from "@/stores/useAuthStore"


const SavedClientsList = () => {
    const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(null)
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const user = useAuthUser()
    const { data: clients, isLoading } = useGetClients(user?.userId)
    const { setClient } = useInvoiceStore()
    const setMode = useFormModeStore((state) => state.setMode)
    const deleteMutation = useDeleteClient()


    const handleSelectClient = (client: ClientInfo) => {
        setClient(client)
        setSelectedClient(client)
        setMode("client", "readOnly")
    }    

    const handleEditClick = (client: ClientInfo) => {
        setClient(client)
        setMode("client", "edit")
    }

    const handleDeleteClick = (clientId: string) => {
        const selected = clients?.find((client) => client.client_id === clientId)

        if (!selected) return

        const confirmed = window.confirm(
            `آیا مطمئن هستید که می خواهید ${selected.client_name} را حذف کنید؟`
        )

        if (!confirmed) return

        deleteMutation.mutate(clientId, {
            onSuccess: () => {
                toast("مشتری با موفقیت حذف شد.")
            },
            onError: () => {
                toast("حذف با مشکل مواجه شد.")
            }
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
                                    selectedClient?.client_name || 
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

                {selectedClient && (
                    <div 
                        className="absolute left-18 top-1/2 transform -translate-y-1/2 flex pointer-events-auto z-20"
                    >
                        <span className="bg-[#ECC8FF] rounded-2xl px-3 py-1 text-black">خریدار</span>
                        <button
                            className="border border-transparent px-1 hover:border-gray-500 rounded-md transition z-20"
                            onClick={(e) => {
                            e.stopPropagation()
                            handleEditClick(selectedClient)
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
                            className="border border-transparent px-1 hover:border-gray-500 rounded-md transition z-20"
                            onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(selectedClient.client_id)
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
                                    {clients?.map((client) => (
                                        <DropdownMenu.Item
                                            key={client.client_id}
                                            className="grid grid-cols-[1fr_auto_auto] items-center gap-2 py-2 px-6 rounded-lg cursor-pointer hover:bg-gray-200 focus:bg-gray-200 outline-none text-sm"
                                            onSelect={() => handleSelectClient(client)}
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                            >
                                                <span 
                                                    className="text-gray-500"
                                                >
                                                    <FarsiText>{client.phone_number}</FarsiText>
                                                </span>
                                                <button
                                                    className="border border-transparent px-1 hover:border-gray-500 rounded-md transition z-20"
                                                    onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEditClick(client)
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
                                                    className="border border-transparent px-1 hover:border-gray-500 rounded-md transition z-20"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteClick(client.client_id)
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
                                                <span>{client.client_name}</span>
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

export default SavedClientsList