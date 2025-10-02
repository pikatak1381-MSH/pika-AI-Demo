import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ProformalInvoice } from "@/lib/types"

interface SubmitProformalInvoiceArgs {
  conversation_id: number
  input_message_id: number
  proformal_invoice: ProformalInvoice
}


export function useSubmitProformalInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      conversation_id,
      input_message_id,
      proformal_invoice,
    }: SubmitProformalInvoiceArgs) => {
      const body = {
        conversation_id,
        input_message_id,
        proformal_invoice
      }


      const res = await fetch("/api/chat/selected-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Backend error details:", errorText)
        console.error("Backend status:", res.status)
        throw new Error(`Failed to submit offers: ${errorText}`)
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversationMessages", variables.conversation_id]
      })
    },
  })
}
