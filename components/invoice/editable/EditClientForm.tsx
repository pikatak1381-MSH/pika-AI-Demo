import { useInvoiceStore } from "@/stores/useInvoiceStore"
import { useEditClient } from "@/hooks/clientHooks/useEditClient"
import InvoiceDivider from "../read-only/InvoiceDivider"
import { motion, AnimatePresence } from "framer-motion"
import Button from "../../ui/Buttons"
import { toast } from "sonner"

interface EditClientForm {
  onClose: (value: boolean) => void
}


const EditClientForm: React.FC<EditClientForm> = ({ onClose }) => {
  const { client } = useInvoiceStore()
  const editMutation = useEditClient()

  const handleEditClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const updates = {
      client_name: formData.get("sale_agent_name") as string,
      registration_number: formData.get("registration_number") as string,
      delivery_address: formData.get("address") as string,
      phone_number: formData.get("phone_number") as string,
      mobile_number: formData.get("mobile_number") as string,
      postal_code: formData.get("postal_code") as string,
      tax_number: formData.get("tax_number") as string,
      national_id: formData.get("national_id") as string
    }

    editMutation.mutate(
      { 
        id: client.client_id, 
        updates 
      }, 
      { 
        onSuccess: () => {
          toast("تغییرات با موفقیت ذخیره شد. ✅")
          editMutation.reset()
          onClose(false)
        },
        onError: () => {
          toast("ثبت تغییرات با خطا مواجه شد. ❌")
          setTimeout(() => editMutation.reset(), 3000)
        }
      }
    )
  }


  return (
    <>
      <InvoiceDivider
          className="mb-4"
      >
          مشخصات خریدار
      </InvoiceDivider>

      <section>
          <AnimatePresence>
              <motion.form
                  onSubmit={handleEditClient}
                  className="grid grid-cols-2 text-sm gap-6 overflow-x-hidden"
              >
                  {/* Client Name */}
                  <label htmlFor="sale_agent_name" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                      نام شخص حقیقی/حقوقی:
                      <input 
                          className="font-medium bg-[#f0f0f0] p-2 mr-1 max-w-48"
                          type="text"
                          id="sale_agent_name"
                          name="sale_agent_name"
                          defaultValue={client.client_name}
                          required
                      />
                  </label>

                  {/* Registration Number */}
                  <label htmlFor="registration_number" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                      شماره ثبت:
                      <input
                          className="font-medium bg-[#f0f0f0] p-2 mr-1 max-w-48 text-start"
                          type="text"
                          id="registration_number"
                          name="registration_number"
                          inputMode="numeric"
                          defaultValue={client.registration_number}
                      />
                  </label>

                  {/* Postal Code */}
                  <label htmlFor="postal_code" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                      کد پستی:
                      <input 
                          className="font-medium bg-[#f0f0f0] p-2 mr-1 max-w-48 text-start"
                          type="text"
                          id="postal_code"
                          name="postal_code"
                          pattern="[0-9]{10}"
                          inputMode="numeric"
                          defaultValue={client.postal_code}
                      />
                  </label>

                  {/* Tax ID */}
                  <label htmlFor="tax_number" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                      شماره اقتصادی:
                      <input 
                          className="font-medium bg-[#f0f0f0] p-2 mr-1 max-w-48"
                          type="text"
                          id="tax_number"
                          name="tax_number"
                          inputMode="numeric"
                          defaultValue={client.tax_number}
                      />
                  </label>

                  {/* Phone Number */}
                  <label htmlFor="phone_number" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                      تلفن:
                      <input
                          className="font-medium bg-[#f0f0f0] p-2 mr-1 max-w-48 text-end"
                          type="tel"
                          id="phone_number"
                          name="phone_number"
                          defaultValue={client.phone_number}
                      />
                  </label>

                  {/* Phone Number */}
                  <label htmlFor="mobile_number" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                      تلفن:
                      <input
                          className="font-medium bg-[#f0f0f0] p-2 mr-1 max-w-48 text-end"
                          type="tel"
                          id="mobile_number"
                          name="mobile_number"
                          defaultValue={client.mobile_number}
                      />
                  </label>

                  {/* National ID */}
                  <label htmlFor="national_id" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                      شناسه ملی:
                      <input 
                          className="font-medium bg-[#f0f0f0] p-2 mr-1 max-w-48"
                          type="text"
                          id="national_id"
                          name="national_id"
                          inputMode="numeric"
                          defaultValue={client.national_id}
                      />
                  </label>

                  {/* Address */}
                  <label htmlFor="address" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2 col-span-2">
                      آدرس:
                      <textarea 
                          className="font-medium bg-[#f0f0f0] p-2 mr-1 resize-none rounded-lg w-full"
                          id="address"
                          name="address"
                          rows={2}
                          defaultValue={client.delivery_address}
                      />
                  </label>

                  <Button
                      className={editMutation.isPending ? "cursor-not-allowed" : ""}
                      variant="primary"
                      type="submit"
                      disabled={editMutation.isPending}
                  >
                      {editMutation.isPending ? "در حال ذخیره" : "ذخیره"}
                  </Button>
              </motion.form>
          </AnimatePresence>
      </section>    
    </>

  )
}

export default EditClientForm