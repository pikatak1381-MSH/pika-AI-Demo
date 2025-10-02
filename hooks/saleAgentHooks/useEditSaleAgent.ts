import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SaleAgentInfo } from "@/lib/types"
import { useInvoiceStore } from "@/stores/useInvoiceStore"

type SaleAgentUpdate = Partial<SaleAgentInfo>

export function useEditSaleAgent() {
    const queryyClient = useQueryClient()
    const { setSaleAgent, saleAgent, resetSaleAgent } = useInvoiceStore()

    return useMutation<SaleAgentInfo, Error, { id: string; updates: SaleAgentUpdate }> ({
            mutationFn: async ({ id, updates }) => {
                const res = await fetch(`/api/sale-agent-accounts/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updates)
                })

                if (!res.ok) {
                    throw new Error ("Failed to update sale agent")
                }

                const text = await res.text()
                
                if (!text) {
                    return { ...saleAgent, ...updates }
                }

                try {
                    return JSON.parse(text) as SaleAgentInfo
                } catch {
                    return { ...saleAgent, ...updates } as SaleAgentInfo
                }
            },

            onMutate: ({ updates }) => {
                setSaleAgent({ ...saleAgent, ...updates })
            },

            onError: () => {
                resetSaleAgent()
            },

            onSuccess: (data) => {
                setSaleAgent(data)
                queryyClient.invalidateQueries({
                    queryKey: ["sale-agents"]
                })
            },
        })
    }
