import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useInvoiceStore } from "@/stores/useInvoiceStore"

export function useDeleteClient() {
    const queryClient = useQueryClient()
    const { resetClient } = useInvoiceStore()

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/client-accounts/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            })

            if (!res.ok) {
                throw new Error("Failed to delete client.")
            }

            return res.json()
        },

        onSuccess: () => {
            resetClient()
            queryClient.invalidateQueries({
                queryKey: ["clients"]
            })
        }
    })
}