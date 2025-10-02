import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ClientInfo } from "@/lib/types"
import { useInvoiceStore } from "@/stores/useInvoiceStore"

type ClientUpdate = Partial<ClientInfo>

export function useEditClient() {
    const queryClient = useQueryClient()
    const { client, setClient, resetClient } = useInvoiceStore()

    return useMutation<ClientInfo, Error, { id: string; updates: ClientUpdate }> ({
            mutationFn: async ({ id, updates }) => {
                const res = await fetch(`/api/client-accounts/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updates)
                })

                if (!res.ok) {
                    throw new Error ("Failed to update client")
                }

                const text = await res.text()

                if (!text) {
                    return { ...client, ...updates }
                }

                try {
                    return JSON.parse(text) as ClientInfo
                } catch  {
                    return { ...client, ... updates } as ClientInfo
                }
            },
            
            onMutate: ({ updates }) => {
                setClient({ ...client, ...updates })
            },

            onError: () => {
                resetClient()
            },

            onSuccess: (data) => {
                setClient(data)
                queryClient.invalidateQueries({
                    queryKey: ["clients"]
                })
            },
        })
    }
