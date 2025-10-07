"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useInvoiceStore } from "@/stores/useInvoiceStore"
import { useSubmitProformalInvoice } from "@/hooks/message/useSubmitProformalInvoice"
import Stepper from "./Stepper"
import ProductTableForm from "./editable/ProductTableForm"
import Button from "../ui/Buttons"
import FinalInvoice from "./read-only/FinalInvoice"
import { ChatbotResponse } from "@/lib/types"
import { toast } from "sonner"
import SaleAgentandClient from "./SaleAgentandClient"
import CloseButton from "../ui/CloseButton"
import { ChevronLeft, ChevronRight } from "lucide-react"

type InvoiceModalProps = {
  isOpen: boolean
  response: ChatbotResponse
  error: string | null
  messageId: number | string
  onClose: () => void
}


const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, response, onClose }) => {
  /* 0 = Products, 1 = SaleAgent and Client, 2 = Preview */
  const [step, setStep] = useState(0)

  const { selectedProducts, header, saleAgent, client, footer, resetAll } = useInvoiceStore()
  
  const submitMutation = useSubmitProformalInvoice()

  /* Navigation handlers */
  const next = () => setStep((step) => Math.min(step + 1, 2))
  const back = () => setStep((step) => Math.max(step - 1, 0))

  /* Final Submit */
  const handleSubmit = () => {
    const invoice = {
      header: header,
      products: selectedProducts,
      saleAgent: saleAgent,
      client: client,
      footer: footer,
    }
    submitMutation.mutate(
      {
        conversation_id: response.conversation_id,
        input_message_id: response.input_message_id,
        proformal_invoice: invoice,
      },
      {
        onSuccess: () => {
          setStep(0)
          onClose()
          toast("پیش‌فاکتور با موفقیت ثبت شد. ✅")
          submitMutation.reset()
          resetAll()
        },
        onError: () => {
          toast("ارسال با خطا مواجه شد. دوباره تلاش کنید. ❌")
          setTimeout(() => submitMutation.reset(), 3000)
        }
      }
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        /* Underlay */
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          {/* Overlay */}
          <div
            className="bg-white w-full min-w-2xl max-w-4xl rounded-2xl shadow-xl relative mb-4 z-50 max-h-[95vh] overflow-auto"
          >
            {/* Sticky Header inside the Modal*/}
            <div
              className="sticky top-0 right-0 bg-[#A3A3A333] backdrop-blur-lg z-50 m-2 pt-2 rounded-2xl"
            >
              <CloseButton
                className="absolute left-0 top-0"
                onClick={() => onClose()}
              />

              <div
                className="px-6"
              >
                <Stepper step={step} />

                {step !== 2 && (
                  <div
                    className="flex justify-start gap-2 py-2 mt-1"
                  >
                    {step !== 0 && (
                      <Button
                        className="flex items-center gap-2"
                        variant="ghost"
                        type="button"
                        onClick={() => (step === 0 ? onClose() : back())}
                      >
                        <ChevronRight />
                        مرحله قبل
                      </Button>
                    )}

                    <Button
                      className="flex items-center gap-2"
                      variant="primary"
                      type="button"
                      onClick={next}
                    >
                      <ChevronLeft />
                      مرحله بعد
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Body */}
            <div
              className="px-6 py-6"
            >
              {/* ProductsModal */}
              {step === 0 && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductTableForm />
                </motion.div>
              )}              

              {/* SaleAgent Modal & Clients Modal */}
              {step === 1 && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, x: 200 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -200 }}
                  transition={{ duration: 0.25, delay: 0.5 }}
                >
                  <SaleAgentandClient />
                </motion.div>
              )}

              {/* Final Preview */}
              {step === 2 && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <FinalInvoice />
                  <div
                    className="flex flex-col justify-between items-start gap-8"
                  >
                    <p
                      className="font-bold text-red-500"
                    >
                      لطفاً قبل از تأیید نهایی، پیش‌فاکتور را با دقت بررسی کنید. پس از تأیید، امکان ویرایش وجود نخواهد داشت.
                    </p>                  
                    <div
                      className="flex gap-2"
                    >
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={back}
                      >
                        مرحله قبل
                      </Button>
                      <Button
                        variant="primary"
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitMutation.isPending}
                      >
                        {submitMutation.isPending ? "در حال ارسال" : "تایید نهایی"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default InvoiceModal