import { create } from "zustand"
import { ProductOffer, SaleAgentInfo, ClientInfo, InvoiceHeaderTypes, InvoiceFooterTypes, ProductSpecifications } from "@/lib/types"

export interface InvoiceFormData {
    header: InvoiceHeaderTypes
    selectedProducts: Array<
        ProductOffer & { selectedSpecifications?: ProductSpecifications[] }
    >
    saleAgent: SaleAgentInfo
    client: ClientInfo
    footer: InvoiceFooterTypes
    showClientForm: boolean
    showSaleAgentForm: boolean
}

interface InvoiceStore extends InvoiceFormData {
    setProducts: (products: ProductOffer[]) => void
    addProduct: (product: ProductOffer) => void
    updateProduct: (productId: string, updateFields: Partial<ProductOffer>) => void
    recalculateFooter: () => void
    removeProduct: (productId: string) => void
    addSpecification: (productId: string, spec: ProductSpecifications) => void
    removeSpecification: (productId: string, spec: ProductSpecifications) => void
    setSaleAgent: (saleAgent: InvoiceFormData["saleAgent"]) => void
    setClient: (client: InvoiceFormData["client"]) => void
    setShowClientForm: (show: boolean) => void
    setShowSaleAgentForm: (show: boolean) => void
    resetClient: () => void
    resetSaleAgent: () => void
    resetAll: () => void
}


export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
    header: {
        proformaInvoiceNumber: "",
        date: "",
    },
    selectedProducts: [],
    saleAgent: {
        sale_agent_id: "",
        sale_agent_name: "",
        registration_number: "", 
        address: "", 
        phone_number: "", 
        postal_code: "", 
        tax_number: "", 
        national_id: "",
    },
    client: {
        client_id: "",
        client_name: "", 
        registration_number: "",
        delivery_address: "",
        phone_number: "",
        mobile_number: "",
        postal_code: "",
        tax_number: "",
        national_id: "",
    },

    footer: {
        totalDiscount: 0,
        totalAfterDiscount: 0,
        invoiceTax: 0,
        grandTotal: 0,
    },
    showClientForm: false,
    showSaleAgentForm: false,

    setProducts: (selectedProducts) => {
        set({ selectedProducts })
        get().recalculateFooter()
    },

    addProduct: (product) => set((state) => {
        const updatedProduct = {
            ...product,
            quantity: product.quantity ?? 1,
            selectedSpecifications: [...product.specifications],
        }

        const updated = [...state.selectedProducts, updatedProduct]
        return { selectedProducts: updated, footer: calculateFooter(updated) }
    }),

    updateProduct: (productId, updateFields) =>
        set((state) => {
            const updated = state.selectedProducts.map((p) =>
                p.id === productId
                    ? {
                        ...p,
                        ...updateFields,
                        totalPrice: (updateFields.quantity ?? p.quantity) * (updateFields.original_price ?? p.original_price),
                        final_price: ((updateFields.quantity ?? p.quantity) * (updateFields.original_price ?? p.original_price)) - (updateFields.discount ?? p.discount)
                    }
                    : p
            )
            return { selectedProducts: updated, footer: calculateFooter(updated) }
    }),

    removeProduct: (productId) =>
        set((state) => {
            const updated = state.selectedProducts.filter((p) => p.id !== productId)
            return { selectedProducts: updated, footer: calculateFooter(updated) }
    }),

    addSpecification: (productId, spec) =>
        set((state) => {
            const updated = state.selectedProducts.map((p) => {
                if (p.id !== productId) return p

                return {
                    ...p,
                    selectedSpecifications: [
                        ...(p.selectedSpecifications ?? []),
                        spec,
                    ],
                }
            })

            return { selectedProducts: updated }
    }),

    removeSpecification: (productId, spec) =>
        set((state) => {
            const updated = state.selectedProducts.map((p) => {
                if (p.id !== productId) return p

                return {
                    ...p,
                    selectedSpecifications: (p.selectedSpecifications ?? []).filter(
                        (s) => 
                            !(
                                s.AttributeName === spec.AttributeName &&
                                s.Value === spec.Value
                            )
                    )
                }
            })

            return { selectedProducts: updated }
    }),

    recalculateFooter: () => {
        const { selectedProducts } = get()
        set({ footer: calculateFooter(selectedProducts) })
    },

    setSaleAgent: (saleAgent) => set({ saleAgent }),

    setClient: (client) => set({ client }),

    setShowClientForm: (show) => set({ showClientForm: show }),

    setShowSaleAgentForm: (show) =>set({ showSaleAgentForm: show }),

    resetClient: () => set({
        client: {
            client_id: "",
            client_name: "", 
            registration_number: "",
            delivery_address: "",
            phone_number: "",
            mobile_number: "",
            postal_code: "",
            tax_number: "",
            national_id: "", 
        },        
    }),

    resetSaleAgent: () => set({
        saleAgent: {
            sale_agent_id: "",
            sale_agent_name: "",
            registration_number: "",
            address: "",
            phone_number: "",
            postal_code: "",
            tax_number: "",
            national_id: "",
        }
    }),

    resetAll: () => set({
        header: { proformaInvoiceNumber: "", date: "" },
        selectedProducts: [],
        saleAgent: {
            sale_agent_id: "",
            sale_agent_name: "", 
            registration_number: "",
            address: "", 
            phone_number: "", 
            postal_code: "", 
            tax_number: "", 
            national_id: "", 
        },
        client: {
            client_id: "",
            client_name: "", 
            registration_number: "",
            delivery_address: "",
            phone_number: "",
            mobile_number: "",
            postal_code: "",
            tax_number: "",
            national_id: "", 
        },
        footer: {
            totalDiscount: 0,
            totalAfterDiscount: 0,
            invoiceTax: 0,
            grandTotal: 0,
        },
    }),
}))

/* Helper functions */
const calculateFooter = (products: ProductOffer[]): InvoiceFooterTypes => {
    const totalDiscount = products.reduce((sum, p) => sum + (p.discount ?? 0), 0)
    const totalAfterDiscount = products.reduce(
        (sum, p) => sum + (p.original_price * p.quantity - (p.discount ?? 0)), 0
    )
    const invoiceTax = Math.round(totalAfterDiscount * 0.09)
    const grandTotal = totalAfterDiscount + invoiceTax

    return { totalDiscount, totalAfterDiscount, invoiceTax, grandTotal }
}