"use client"

import ClientForm from "./editable/ClientForm"
import SaleAgentForm from "./editable/SaleAgentForm"
import Image from "next/image"
import Button from "../ui/Buttons"
import { useFormModeStore } from "@/stores/useFormModeStore"
import { useInvoiceStore } from "@/stores/useInvoiceStore"
import AddUserFormModal from "./editable/AddUserFormModal"

const SaleAgentandClient = () => {
    const clientMode = useFormModeStore((state) => state.modes.client)
    const setMode = useFormModeStore((state) => state.setMode)
    const { resetClient, resetSaleAgent } = useInvoiceStore()
    
    return ( 
    <div
        className="flex flex-col space-y-24 text-sm text-[#6E6E6E]"
    >
        <div
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        >
            <SaleAgentForm />

            <ClientForm />
        </div>

        
        {/* Adding new Sale Agent and Client Modal */}
        {clientMode === "new" && (
            <AddUserFormModal />
        )}
        
        <Button
            className="w-fit flex items-center self-start gap-2 m-4 z-10 "
            variant="secondary"
            onClick={() => {
                setMode("client", "new")
                resetClient()
                resetSaleAgent()
            }}
        >
            <Image
                className="text-blue-500"
                src="/icons/blue-plus-icon.svg"
                alt=""
                width={24}
                height={24}
            />
            اضافه کردن خریدار و فروشنده جدید          
        </Button>
    </div>
  )
}

export default SaleAgentandClient