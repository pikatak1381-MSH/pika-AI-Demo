import SaleAgentForm from "../invoice/editable/SaleAgentForm"

const SectionSavedSaleAgents = () => {
  return (
    <div
        className="flex flex-col"
    >
        <h2 className="text-lg font-medium text-nowrap">فروشندگان</h2>
        <hr className="my-2"/>
        <div
            className="mt-2"
        >
            <SaleAgentForm />
        </div>
    </div>
  )
}

export default SectionSavedSaleAgents