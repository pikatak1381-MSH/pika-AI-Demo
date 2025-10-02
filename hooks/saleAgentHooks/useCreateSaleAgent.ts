import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SaleAgentInfo } from "@/lib/types"

interface CreateSaleAgentArgs extends SaleAgentInfo {
    user_id: string | null
}


export function useCreateSaleAgent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            sale_agent_name,
            registration_number,
            address,
            phone_number,
            postal_code,
            tax_number,
            national_id,
            user_id,
        }: CreateSaleAgentArgs) => {
            const body = {
                sale_agent_name,
                registration_number,
                address,
                phone_number,
                postal_code,
                tax_number,
                national_id,
                user_id,
            }

            const res = await fetch("/api/sale-agent-accounts/create-sale-agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const errorText = await res.text()
                console.error("Backend error details:", errorText)
                console.error("Backend status:", res.status)
                throw new Error(`Failed to submit sale agent: ${errorText}`)
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["sale-agents", variables.user_id]
            })
        },
    })
}