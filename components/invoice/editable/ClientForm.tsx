"use client"

import { AnimatePresence } from "framer-motion"
import MinimalClientForm from "../read-only/MinimalClientForm"
import AnimatedContainer from "@/components/ui/AnimatedContainer"
import EditClientForm from "./EditClientForm"
import SavedClientsList from "./SavedClientsList"
import { useFormModeStore } from "@/stores/useFormModeStore"


const ClientForm = () => {
  const clientMode = useFormModeStore((state) => state.modes.client)
  const setMode = useFormModeStore((state) => state.setMode)

  return (
    <div
      className="min-h-96 flex flex-col gap-6 overflow-x-hidden"
    >
      <SavedClientsList />
      
      {/* Un-editable client form */}
      <AnimatePresence>
        {clientMode === "readOnly" && (
          <AnimatedContainer
            className="overflow-hidden"
            variant="fade"
          >
            <MinimalClientForm />
          </AnimatedContainer>
        )}

        {/* Editable client form */}
        {clientMode === "edit" && (
          <AnimatedContainer
            variant="fade"
          >
            <EditClientForm 
              onClose={() => setMode("client", null)}
            />
          </AnimatedContainer>
        )}        
      </AnimatePresence>
    </div>
  )
}

export default ClientForm