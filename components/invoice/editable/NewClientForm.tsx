"use client"

import { useInvoiceStore } from "@/stores/useInvoiceStore"
import { motion, AnimatePresence } from "framer-motion"
import { useCreateClient } from "@/hooks/clientHooks/useCreateClient"
import { toast } from "sonner"
import Button from "../../ui/Buttons"
import Image from "next/image"
import { useFormModeStore } from "@/stores/useFormModeStore"
import { useAuthStore } from "@/stores/useAuthStore"


const NewClientForm = () => {
    const { client, setClient, resetClient } = useInvoiceStore()
    const closeForm = useFormModeStore((state) => state.resetAll)
    const createClientMutation = useCreateClient()
    const { userId } = useAuthStore()

    const handleCreateClient = (e: React.FormEvent) => {
        e.preventDefault()
    
        createClientMutation.mutate(
        {
            client_id: client.client_id,
            client_name: client.client_name,
            registration_number: client.registration_number,
            postal_code: client.postal_code,
            mobile_number: client.mobile_number,
            tax_number: client.tax_number,
            phone_number:  client.phone_number,
            national_id: client.national_id,
            delivery_address: client.delivery_address,
            user_id: userId
        },
        {
            onSuccess: () => {
                toast("مشتری با موفقیت ثبت شد. ✅")
                createClientMutation.reset()
                resetClient()
                closeForm()
            },
            onError: () => {
                toast("ثبت مشتری موفقیت آمیز نبود. ❌")
                setTimeout(() => createClientMutation.reset(), 3000)
            }
        },
    )
  }
    
  return (
    <AnimatePresence>
        <motion.form
            className="grid grid-cols-2 text-sm gap-6 p-6 overflow-hidden mt-16"
            onSubmit={handleCreateClient}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
        >
            {/* Client Name */}
            <label htmlFor="fullName" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                نام شخص حقیقی/حقوقی:
                <input 
                    className="w-full font-medium max-w-64 bg-white px-2 py-1 mr-1 border border-[#CED4DA] rounded-2xl"
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={client.client_name}
                    onChange={(e) => 
                        setClient({...client,  client_name: e.target.value })
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
                    value={client.registration_number}
                    onChange={(e) => 
                        setClient({...client,  registration_number: e.target.value })
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
                    value={client.postal_code}
                    onChange={(e) => 
                        setClient({...client,  postal_code: e.target.value })
                    }
                />
            </label>


            {/* Mobile Number */}
            <label htmlFor="mobileNumber" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                شماره همراه:
                <input 
                    className="w-full font-medium max-w-64 bg-white px-2 py-1 mr-1 border border-[#CED4DA] rounded-2xl"
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    pattern="09[0-9]{9}"
                    value={client.mobile_number}
                    onChange={(e) => 
                        setClient({...client,  mobile_number: e.target.value })
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
                    value={client.tax_number}
                    onChange={(e) => 
                        setClient({...client,  tax_number: e.target.value })
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
                    value={client.phone_number}
                    onChange={(e) => 
                        setClient({...client,  phone_number: e.target.value })
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
                    value={client.national_id}
                    onChange={(e) => 
                        setClient({...client,  national_id: e.target.value })
                    }
                />
            </label>

            {/* Delivery Address */}
            <label htmlFor="address" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2 col-span-2">
                آدرس محل تحویل:
                <textarea 
                    className="font-medium bg-white p-2 mr-1 resize-y min-h-20 max-h-36 border border-[#CED4DA] rounded-2xl w-full overflow-y-auto"
                    id="address"
                    name="address"
                    rows={2}
                    value={client.delivery_address}
                    onChange={(e) => 
                        setClient({...client, delivery_address: e.target.value })
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

export default NewClientForm