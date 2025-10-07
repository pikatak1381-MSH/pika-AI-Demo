"use client"

import ClientForm from "./editable/ClientForm"
import SaleAgentForm from "./editable/SaleAgentForm"
import Button from "../ui/Buttons"
import { useInvoiceStore } from "@/stores/useInvoiceStore"
import { useModalStore } from "@/stores/useModalStore"
import { Plus } from "lucide-react"

const SaleAgentandClient = () => {
    const { resetClient, resetSaleAgent } = useInvoiceStore()
    const openAddUser = useModalStore((state) => state.openAddUSer)
    
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
        
        <Button
            className="w-fit flex items-center self-start gap-2 m-4 z-10 "
            variant="secondary"
            onClick={() => {
                resetClient()
                resetSaleAgent()
                openAddUser({ entity: "client", mode: "new" })
            }}
        >
            <Plus />
            اضافه کردن خریدار و فروشنده جدید          
        </Button>
    </div>
  )
}

export default SaleAgentandClient