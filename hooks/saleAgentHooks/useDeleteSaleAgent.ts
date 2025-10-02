import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useInvoiceStore } from "@/stores/useInvoiceStore"

export function useDeleteSaleAgent() {
    const queryClient = useQueryClient()
    const { resetSaleAgent } = useInvoiceStore()

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/sale-agent-accounts/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            })

            if (!res.ok) {
                throw new Error("Failed to delete sale agent.")
            }

            return res.json()
        },

        onSuccess: () => {
            resetSaleAgent()
            queryClient.invalidateQueries({
                queryKey: ["sale-agents"]
            })
        }
    })
}