import { create } from "zustand"

type Entity = "client" | "saleAgent"
type Mode = "new" | "edit" | "readOnly" | null

interface FormModeState {
  modes: Record<Entity, Mode>
  setMode: (entity: Entity, mode: Mode) => void
  resetMode: (entity: Entity) => void
  resetAll: () => void
  isActive: (entity: Entity, mode?: Mode) => boolean
}


export const useFormModeStore = create<FormModeState>((set, get): FormModeState => ({
  modes: {
    client: null,
    saleAgent: null,
  },
  setMode: (entity, mode) =>
    set((state) => ({
      modes: { ...state.modes, [entity]: mode },
    })),
  resetMode: (entity) =>
    set((state) => ({
      modes: { ...state.modes, [entity]: null },
    })),
  resetAll: () =>
    set(() => ({
      modes: { client: null, saleAgent: null },
    })),
  isActive: (entity, mode) => {
    const current = get().modes[entity]
    return mode ? current === mode : current !== null
  },
}))