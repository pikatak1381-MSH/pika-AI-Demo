import { create } from "zustand"

interface Specification {
    value: string
    attribute: string
}

interface PikaSnapStore {
    specifications: Specification[]
    setSpecifications: (specs: Specification[]) => void
    clearSpecifications: () => void
}


export const usePikaSnapStore = create<PikaSnapStore>((set) => ({
    specifications: [],
    setSpecifications: (specs) => set({ specifications: specs }),
    clearSpecifications: () => set({ specifications: [] }),
}))
