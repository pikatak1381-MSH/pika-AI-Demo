import ClientForm from "../invoice/editable/ClientForm"

const SectionSavedClients = () => {
  return (
    <div
        className="flex flex-col"
    >
        <h2 className="text-lg font-medium text-nowrap">خریداران</h2>
        <hr className="my-2"/>
        <div
            className="mt-2"
        >
            <ClientForm />
        </div>
    </div>
  )
}

export default SectionSavedClients