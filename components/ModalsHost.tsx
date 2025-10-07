"use client"

import { AddUserModalProps, InvoiceModalProps, SettingsModalProps, useModalStore } from "@/stores/useModalStore"
import { SettingsModal } from "./profile/SettingsModal"
import InvoiceModal from "./invoice/InvoiceModal"
import ProfileModal from "./profile/ProfileModal"
import AddUserFormModal from "./invoice/editable/AddUserFormModal"


export function ModalsHost() {
  const { activeModal, modalProps, close } = useModalStore()

  return (
    <>
        {activeModal === "settings" && (
            <SettingsModal
                isOpen
                section={(modalProps as SettingsModalProps).section}
                onClose={close}
            />
        )}

        {activeModal === "profile" && (
            <ProfileModal isOpen onClose={close} />
        )}

        {activeModal === "invoice" && (
            <InvoiceModal
                isOpen
                response={(modalProps as InvoiceModalProps).response}
                error={(modalProps as InvoiceModalProps).error ?? null}
                messageId={(modalProps as InvoiceModalProps).messageId}
                onClose={close}
            />
        )}

        {activeModal === "addUser" && (
            <AddUserFormModal 
                isOpen
                entity={(modalProps as AddUserModalProps).entity}
                mode={(modalProps as AddUserModalProps).mode}
                onClose={close}
            />
        )}
    </>
  )
}
