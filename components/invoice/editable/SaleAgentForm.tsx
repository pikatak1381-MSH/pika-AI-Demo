"use client"

import { AnimatePresence } from "framer-motion"
import AnimatedContainer from "../../ui/AnimatedContainer"
import EditSaleAgentForm from "./EditSaleAgentForm"
import SavedSaleAgentsList from "./SavedSaleAgentsList"
import { useFormModeStore } from "@/stores/useFormModeStore"
import MinimalSaleAgentForm from "../read-only/MinimalSaleAgentForm"


const SaleAgentForm = () => {
  const saleAgentMode = useFormModeStore((state) => state.modes.saleAgent)
  const setMode = useFormModeStore((state) => state.setMode)
 
  return (
    <div
      className="flex flex-col gap-6 overflow-x-hidden"
    >
      <SavedSaleAgentsList />
      
      {/* Un-editable sale agent form */}
      <AnimatePresence>
        {saleAgentMode && (
          <AnimatedContainer
            className="overflow-hidden"
            variant="fade"
          >
            <MinimalSaleAgentForm />
          </AnimatedContainer>
        )}

        {/* Editable sale agent form */}
        {saleAgentMode === "edit" && (
          <AnimatedContainer
            variant="fade"
          >
            <EditSaleAgentForm
              onClose={() => setMode("saleAgent", null)}
            />
          </AnimatedContainer>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SaleAgentForm