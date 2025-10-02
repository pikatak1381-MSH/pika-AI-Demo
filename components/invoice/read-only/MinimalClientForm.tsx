import { useInvoiceStore } from "@/stores/useInvoiceStore"
import FarsiText from "../../ui/FarsiText"

const MinimalClientForm = () => {
  const { client } = useInvoiceStore()

  return (
      <section
        className="grid grid-cols-2 text-sm gap-8 p-1 text-black"
      >
        {/* Client Name */}
        <p className="flex justify-start font-semibold text-nowrap gap-1 col-span-2">
            نام شخص حقیقی‌/‌حقوقی: 
            <span className="font-medium text-zinc-700">{client.client_name}</span>
        </p>

        {/* Registration Number */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            شماره ثبت: <span className="font-medium text-zinc-700">
            <FarsiText>{client.registration_number}</FarsiText></span>
        </p>

        {/* Postal Code */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            کد پستی: <span className="font-medium text-zinc-700">
            <FarsiText>{client.postal_code}</FarsiText></span>
        </p>

        {/* Mobile Number */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            شماره همراه: <span className="font-medium text-zinc-700">
            <FarsiText>{client.mobile_number}</FarsiText></span>
        </p>

        {/* Tax ID */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            شماره اقتصادی: <span className="font-medium text-zinc-700">
            <FarsiText>{client.tax_number}</FarsiText></span>
        </p>

        {/* Phone Number */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            تلفن: <span className="font-medium text-zinc-700">
            <FarsiText>{client.phone_number}</FarsiText></span>
        </p>

        {/* National ID */}
        <p className="flex justify-start font-semibold text-nowrap gap-2">
            شناسه ملی: <span className="font-medium text-zinc-700">
            <FarsiText>{client.national_id}</FarsiText></span>
        </p>

        {/* Delivery address */}
        <p className="flex justify-start font-semibold text-nowrap gap-2 col-span-2">
            آدرس محل تحویل: <span className="font-medium text-zinc-700 text-wrap">
            <FarsiText>{client.delivery_address}</FarsiText></span>
        </p>
      </section>
  )
}

export default MinimalClientForm