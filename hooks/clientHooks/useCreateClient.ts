import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ClientInfo } from "@/lib/types"


interface CreateClientArgs extends ClientInfo {
    user_id: string | null
}


export function useCreateClient() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            client_name,
            registration_number,
            delivery_address,
            phone_number,
            mobile_number,
            postal_code,
            tax_number,
            national_id,
            user_id,
        }: CreateClientArgs) => {
            const body = {
                client_name,
                registration_number,
                delivery_address,
                phone_number,
                mobile_number,
                postal_code,
                tax_number,
                national_id,
                user_id,
            }

            const res = await fetch("/api/client-accounts/create-client", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const errorText = await res.text()
                console.error("Backend error details:", errorText)
                console.error("Backend status:", res.status)
                throw new Error(`Failed to submit client: ${errorText}`)
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["clients", variables.user_id]
            })
        },
    })
}