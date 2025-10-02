import { useEditSaleAgent } from "@/hooks/saleAgentHooks/useEditSaleAgent"
import { useInvoiceStore } from "@/stores/useInvoiceStore"
import InvoiceDivider from "../read-only/InvoiceDivider"
import { motion, AnimatePresence } from "framer-motion"
import Button from "../../ui/Buttons"
import { toast } from "sonner"

interface EditSaleAgentFormProps {
  onClose: (value: boolean) => void
}


const EditSaleAgentForm: React.FC<EditSaleAgentFormProps> = ({ onClose }) => {
  const { saleAgent } = useInvoiceStore()
  const editMutation = useEditSaleAgent()

  const handleEditSaleAgent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const updates = {
      sale_agent_name: formData.get("sale_agent_name") as string,
      registration_number: formData.get("registration_number") as string,
      address: formData.get("address") as string,
      phone_number: formData.get("phone_number") as string,
      postal_code: formData.get("postal_code") as string,
      tax_number: formData.get("tax_number") as string,
      national_id: formData.get("national_id") as string
    }

    editMutation.mutate(
      { 
        id: saleAgent.sale_agent_id, 
        updates 
      }, 
      { 
        onSuccess: () => {
          toast("تغییرات با موفقیت ذخیره شد. ✅")
          onClose(false)
          editMutation.reset()
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
          مشخصات فروشنده
      </InvoiceDivider>

      <section>
          <AnimatePresence>
              <motion.form
                  onSubmit={handleEditSaleAgent}
                  className="grid grid-cols-2 text-sm gap-6 overflow-x-hidden"
              >
                  {/* SaleAgent Name */}
                  <label htmlFor="sale_agent_name" className="flex flex-col justify-start items-start font-semibold text-nowrap gap-1 px-2">
                      نام شخص حقیقی/حقوقی:
                      <input 
                          className="font-medium bg-[#f0f0f0] p-2 mr-1 max-w-48"
                          type="text"
                          id="sale_agent_name"
                          name="sale_agent_name"
                          defaultValue={saleAgent.sale_agent_name}
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
                          defaultValue={saleAgent.registration_number}
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
                          defaultValue={saleAgent.postal_code}
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
                          defaultValue={saleAgent.tax_number}
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
                          defaultValue={saleAgent.phone_number}
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
                          defaultValue={saleAgent.national_id}
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
                          defaultValue={saleAgent.address}
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

export default EditSaleAgentForm