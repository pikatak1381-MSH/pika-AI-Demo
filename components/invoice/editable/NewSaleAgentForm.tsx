"use client"

import { useInvoiceStore } from "@/stores/useInvoiceStore"
import { motion, AnimatePresence } from "framer-motion"
import { useCreateSaleAgent } from "@/hooks/saleAgentHooks/useCreateSaleAgent"
import { toast } from "sonner"
import Button from "../../ui/Buttons"
import Image from "next/image"
import { useFormModeStore } from "@/stores/useFormModeStore"
import { useAuthStore } from "@/stores/useAuthStore"


const NewSaleAgentForm = () => {
    const { saleAgent, setSaleAgent, resetSaleAgent } = useInvoiceStore()
    const closeForm = useFormModeStore((state) => state.resetAll)
    const createSaleAgentMutation = useCreateSaleAgent()
    const { userId } = useAuthStore()



    const handleCreateSaleAgent = (e: React.FormEvent) => {
    e.preventDefault()
    
    createSaleAgentMutation.mutate(
      {
        sale_agent_id: saleAgent.sale_agent_id,
        sale_agent_name: saleAgent.sale_agent_name,
        registration_number: saleAgent.registration_number,
        postal_code: saleAgent.postal_code,
        tax_number: saleAgent.tax_number,
        phone_number:  saleAgent.phone_number,
        national_id: saleAgent.national_id,
        address: saleAgent.address,
        user_id: userId
      },
      {
        onSuccess: () => {
            toast("فروشنده با موفقیت ثبت شد. ✅")
            createSaleAgentMutation.reset()
            resetSaleAgent()
            closeForm()
        },
        onError: () => {
            toast("ثبت فروشنده موفقیت آمیز نبود. ❌")
            setTimeout(() => createSaleAgentMutation.reset(), 3000)
        }
      },
    )
  }
    
  return (
    <AnimatePresence>
        <motion.form
            onSubmit={handleCreateSaleAgent}
            className="grid grid-cols-1 md:grid-cols-2 text-sm gap-4 p-6 overflow-x-hidden mt-16"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}            
        >
            {/* SaleAgent Name */}
            <label htmlFor="fullName" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                نام شخص حقیقی/حقوقی:
                <input 
                    className="w-full font-medium max-w-64 bg-white px-2 py-1 mr-1 border border-[#CED4DA] rounded-2xl"
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={saleAgent.sale_agent_name}
                    onChange={(e) => 
                        setSaleAgent({...saleAgent,  sale_agent_name: e.target.value })
                    }
                    required
                />
            </label>

            {/* Registration Number */}
            <label htmlFor="registrationNumber" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                شماره ثبت:
                <input
                    className="w-full font-medium max-w-64 bg-white px-2 py-1 mr-1 border border-[#CED4DA] rounded-2xl"
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    inputMode="numeric"
                    value={saleAgent.registration_number}
                    onChange={(e) => 
                        setSaleAgent({...saleAgent,  registration_number: e.target.value })
                    }
                />
            </label>

            {/* Postal Code */}
            <label htmlFor="postalCode" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                کد پستی:
                <input 
                    className="w-full font-medium max-w-64 bg-white px-2 py-1 mr-1 border border-[#CED4DA] rounded-2xl"
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    pattern="[0-9]{10}"
                    inputMode="numeric"
                    value={saleAgent.postal_code}
                    onChange={(e) => 
                        setSaleAgent({...saleAgent,  postal_code: e.target.value })
                    }
                />
            </label>

            {/* Tax ID */}
            <label htmlFor="taxId" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                شماره اقتصادی:
                <input 
                    className="w-full font-medium max-w-64 bg-white px-2 py-1 mr-1 border border-[#CED4DA] rounded-2xl"
                    type="text"
                    id="taxId"
                    name="taxId"
                    inputMode="numeric"
                    value={saleAgent.tax_number}
                    onChange={(e) => 
                        setSaleAgent({...saleAgent,  tax_number: e.target.value })
                    }
                />
            </label>

            {/* Phone Number */}
            <label htmlFor="phoneNumber" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                تلفن:
                <input
                    className="w-full font-medium max-w-64 bg-white px-2 py-1 mr-1 border border-[#CED4DA] rounded-2xl"
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={saleAgent.phone_number}
                    onChange={(e) => 
                        setSaleAgent({...saleAgent,  phone_number: e.target.value })
                    }
                />
            </label>

            {/* National ID */}
            <label htmlFor="nationalId" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                شناسه ملی:
                <input 
                    className="w-full font-medium max-w-64 bg-white px-2 py-1 mr-1 border border-[#CED4DA] rounded-2xl"
                    type="text"
                    id="nationalId"
                    name="nationalId"
                    inputMode="numeric"
                    value={saleAgent.national_id}
                    onChange={(e) => 
                        setSaleAgent({...saleAgent,  national_id: e.target.value })
                    }
                />
            </label>

            {/* Address */}
            <label htmlFor="address" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2 md:col-span-2">
                آدرس:
                <textarea 
                    className="font-medium bg-white p-2 mr-1 resize-y min-h-20 max-h-36 rounded-2xl w-full overflow-y-auto border border-[#CED4DA]"
                    id="address"
                    name="address"
                    rows={2}
                    value={saleAgent.address}
                    onChange={(e) => 
                        setSaleAgent({...saleAgent, address: e.target.value })
                    }
                />
            </label>

            <div
                className="flex items-center gap-2 p-2"
            >
                <Button
                    className="flex items-center gap-1"
                    type="submit"
                >
                    <Image
                        className="w-3.75 h-3 object-cover"
                        src="/icons/horizontal-send-icon.svg"
                        alt=""
                        width={15}
                        height={12}
                    />
                    ثبت اطلاعات 
                </Button>
            </div>
        </motion.form>
    </AnimatePresence>
  )
}

export default NewSaleAgentForm