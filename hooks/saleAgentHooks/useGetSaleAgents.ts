import { useQuery } from "@tanstack/react-query"
import { SaleAgentInfo } from "@/lib/types"

export function useGetSaleAgents(userId: string | null) {
    return useQuery<SaleAgentInfo[]>({
        queryKey: ["sale-agents", userId],
        queryFn: async () => {
            if (!userId) throw new Error("No userId Provided")

            const res = await fetch(`/api/sale-agent-accounts/get-sale-agents-by-user?userId=${userId}&skip=0&limit=100`)

            if (!res.ok) throw new Error("Failed to fetch clients")
            return res.json()
        },

        enabled: !!userId,

        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
    })
}