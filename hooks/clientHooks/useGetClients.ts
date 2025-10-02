import { useQuery } from "@tanstack/react-query"
import { ClientInfo } from "@/lib/types"

export function useGetClients(userId: string | null) {
    return useQuery<ClientInfo[]>({
        queryKey: ["clients", userId],
        queryFn: async () => {
            if (!userId) throw new Error("No userId Provided")

            const res = await fetch(`/api/client-accounts/get-clients-by-user?userId=${userId}&skip=0&limit=100`)

            if (!res.ok) throw new Error("Failed to fetch clients")
            return res.json()
        },

        enabled: !!userId,

        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
    })
}