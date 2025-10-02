import InvoiceDivider from "../read-only/InvoiceDivider"
import { useInvoiceStore } from "@/stores/useInvoiceStore"
import FarsiText from "../../ui/FarsiText"

const InvoiceClient = () => {
  const { client } = useInvoiceStore()

  return (
    <>
      <InvoiceDivider
        className="mb-4"
      >
        مشخصات خریدار
      </InvoiceDivider>
      <section
        className="grid grid-cols-2 text-sm gap-8 px-2"
      >
        {/* Client Name */}
        <p className="flex justify-start font-semibold text-nowrap gap-1">
            نام شخص حقیقی‌/‌حقوقی: 
            <span className="font-medium">{client.client_name}</span>
        </p>

        {/* Registration Number */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            شماره ثبت: <span className="font-medium">
            <FarsiText>{client.registration_number}</FarsiText></span>
        </p>

        {/* Postal Code */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            کد پستی: <span className="font-medium">
            <FarsiText>{client.postal_code}</FarsiText></span>
        </p>

        {/* Mobile Number */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            شماره همراه: <span className="font-medium">
            <FarsiText>{client.mobile_number}</FarsiText></span>
        </p>

        {/* Tax ID */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            شماره اقتصادی: <span className="font-medium">
            <FarsiText>{client.tax_number}</FarsiText></span>
        </p>

        {/* Phone Number */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            تلفن: <span className="font-medium">
            <FarsiText>{client.phone_number}</FarsiText></span>
        </p>

        {/* National ID */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            شناسه ملی: <span className="font-medium">
            <FarsiText>{client.national_id}</FarsiText></span>
        </p>

        {/* Delivery address */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            آدرس محل تحویل: <span className="font-medium text-wrap">
            <FarsiText>{client.delivery_address}</FarsiText></span>
        </p>
      </section>
    </>
  )
}

export default InvoiceClient