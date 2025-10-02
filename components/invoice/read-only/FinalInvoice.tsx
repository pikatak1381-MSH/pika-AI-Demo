import InvoiceClient from "./InvoiceClient"
import InvoiceFooter from "./InvoiceFooter"
import InvoiceHeader from "./InvoiceHeader"
import InvoiceSaleAgent from "./InvoiceSaleAgent"
import InvoiceTable from "./InvoiceTable"


const FinalInvoice = () => {

  return (
    <div
        className="w-full flex flex-col"
    >
        <InvoiceHeader />
        <InvoiceSaleAgent />
        <InvoiceClient />
        <InvoiceTable />
        <InvoiceFooter />
    </div>
  )
}

export default FinalInvoice