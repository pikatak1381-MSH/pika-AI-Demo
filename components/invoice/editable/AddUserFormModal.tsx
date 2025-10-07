"use client"

import Button from "@/components/ui/Buttons"
import { useState } from "react"
import NewClientForm from "./NewClientForm"
import NewSaleAgentForm from "./NewSaleAgentForm"
import { Entity, Mode } from "@/stores/useModalStore"
import { UserRoundPlus } from "lucide-react"
import CloseButton from "@/components/ui/CloseButton"


type AddUserFormModalProps = {
    isOpen: boolean
    entity: Entity
    mode: Mode
    onClose: () => void
}

const AddUserFormModal: React.FC<AddUserFormModalProps> = ({ onClose }) => {
    const [form, setForm] = useState<"client" | "saleAgent">("client")

    return (
    /* underlay */
    <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
        {/* Overlay */}
        <div
            className="bg-white w-full max-w-4xl rounded-2xl shadow-xl relative z-50 h-[700px]"
        >
            {/* Modal header */}
            <div
                className="flex items-center justify-between p-4"
            >
                <div
                    className="flex items-center gap-2 bg-[#EEEEEE] rounded-2xl px-2 py-1"
                >
                    <Button
                        className="flex items-center gap-2"
                        variant={form === "client" ? "primary" : "ghost"}
                        onClick={() => setForm("client")}
                    >
                        <UserRoundPlus
                            className={`${form === "client" ? "text-white" : "text-blue-500"}`}
                            size={24}
                        />
                        اضافه کردن خریدار
                    </Button>
                    
                    <Button
                        className="flex items-center gap-2"
                        variant={form === "saleAgent" ? "primary" : "ghost"}
                        onClick={() => setForm("saleAgent")}
                    >
                        <UserRoundPlus
                            className={`${form === "saleAgent" ? "text-white" : "text-blue-500"}`}
                            size={24}
                        />
                        اضافه کردن فروشنده
                    </Button>

                    <CloseButton
                        onClick={() => onClose()}
                    />
                </div>
            </div>

            {form === "client" ? (
                <NewClientForm />
            ) : (
                <NewSaleAgentForm />
            )}
        </div>
    </div>
  )
}

export default AddUserFormModal