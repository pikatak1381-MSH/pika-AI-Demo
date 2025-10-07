import { create } from "zustand"
import { ChatbotResponse } from "@/lib/types"

// Modal-specific types
export type SectionId = "عمومی" | "حساب کاربری" | "پشتیبانی" | "خریداران" | "فروشندگان" | "دیگر محصولات"
export type Entity = "client" | "saleAgent"
export type Mode = "new" | "edit" | "readOnly" | null

// Props per modal
export type SettingsModalProps = { section?: SectionId }
export type InvoiceModalProps = {
  response: ChatbotResponse
  error: string | null
  messageId: number | string
}
export type ProfileModalProps = Record<string, never>

export type AddUserModalProps = {
  entity: Entity
  mode: Mode
}

type ModalPropsMap = {
  settings: SettingsModalProps
  invoice: InvoiceModalProps
  profile: ProfileModalProps
  addUser: AddUserModalProps
}

// Union of modal keys
export type ModalType = keyof ModalPropsMap

interface ModalState {
  activeModal: ModalType | null
  modalProps: Partial<ModalPropsMap[ModalType]>

  // Generic open/close
  open: <T extends ModalType>(modal: T, props?: ModalPropsMap[T]) => void
  close: () => void

  // Helpers for each modal
  openSettings: (section?: SectionId) => void
  openProfile: () => void
  openInvoice: (props: InvoiceModalProps) => void
  openAddUSer: (props: AddUserModalProps) => void

  isOpen: (modal: ModalType) => boolean
}

export const useModalStore = create<ModalState>((set, get) => ({
  activeModal: null,
  modalProps: {},

  open: <T extends ModalType>(modal: T, props?: ModalPropsMap[T]) =>
    set({ activeModal: modal, modalProps: props ?? ({} as ModalPropsMap[T]) }),

  close: () => set({ activeModal: null, modalProps: {} }),

  // helpers
  openSettings: (section = "عمومی") =>
    get().open("settings", { section }),
  openProfile: () => get().open("profile"),
  openInvoice: (props) => get().open("invoice", props),
  openAddUSer: (props) => get().open("addUser", props),

  isOpen: (modal) => get().activeModal === modal,
}))
