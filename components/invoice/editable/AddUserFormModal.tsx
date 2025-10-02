"use client"

import Button from "@/components/ui/Buttons"
import CloseButton from "@/components/ui/CloseButton"
import Image from "next/image"
import { useState } from "react"
import NewClientForm from "./NewClientForm"
import NewSaleAgentForm from "./NewSaleAgentForm"
import { useFormModeStore } from "@/stores/useFormModeStore"


const AddUserFormModal = () => {
    const [form, setForm] = useState<"client" | "saleAgent">("client")

    const closeForm = useFormModeStore((state) => state.resetAll)

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
                        <Image
                            className="w-6 h-6 object-cover"
                            src={form === "client" ? "/icons/white-add-user-icon.svg" : "/icons/blue-add-user-icon.svg"}
                            alt=""
                            width={24}
                            height={24}
                        />
                        اضافه کردن خریدار
                    </Button>

                    <Button
                        className="flex items-center gap-2"
                        variant={form === "saleAgent" ? "primary" : "ghost"}
                        onClick={() => setForm("saleAgent")}
                    >
                        <Image
                            className="w-6 h-6 object-cover"
                            src={form === "saleAgent" ? "/icons/white-add-user-icon.svg" : "/icons/blue-add-user-icon.svg"}
                            alt=""
                            width={24}
                            height={24}
                        />
                        اضافه کردن فروشنده
                    </Button>
                </div>
                <CloseButton
                    onClick={() => closeForm()}
                />
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