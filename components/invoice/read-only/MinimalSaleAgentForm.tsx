import { useInvoiceStore } from "@/stores/useInvoiceStore"
import FarsiText from "../../ui/FarsiText"

const MinimalSaleAgentForm = () => {
    const { saleAgent } = useInvoiceStore()

    return (
        <section
            className="grid grid-cols-2 text-sm gap-8 p-1 text-black"
        >
            {/* SaleAgent Name */}
            <p className="flex justify-start font-semibold text-nowrap gap-1 col-span-2">نام شخص حقیقی‌/‌حقوقی: <span className="font-medium text-zinc-700">{saleAgent.sale_agent_name}</span></p>

            {/* Registration Number */}
            <p className="flex justify-start font-semibold text-nowrap gap-1">
                شماره ثبت: <span className="font-medium  text-zinc-700">
                <FarsiText>{saleAgent.registration_number}</FarsiText></span>
            </p>

            {/* Phone Number */}
            <p className="flex justify-start font-semibold text-nowrap gap-2">
                تلفن: <span className="font-medium  text-zinc-700">
                <FarsiText>{saleAgent.phone_number}</FarsiText></span>
            </p>

            {/* Postal Code */}
            <p className="flex justify-start font-semibold text-nowrap gap-2">کد پستی: <span className="font-medium  text-zinc-700"><FarsiText>{saleAgent.postal_code}</FarsiText></span></p>



            {/* Tax ID */}
            <p className="flex justify-start font-semibold text-nowrap gap-2">
                شماره اقتصادی: <span className="font-medium  text-zinc-700">
                <FarsiText>{saleAgent.tax_number}</FarsiText></span>
            </p>

            {/* National ID */}
            <p className="flex justify-start font-semibold text-nowrap gap-2">
                شناسه ملی: <span className="font-medium  text-zinc-700">
                <FarsiText>{saleAgent.national_id}</FarsiText></span>
            </p>

            {/* Address */}
            <p className="flex justify-start font-semibold text-nowrap gap-2 col-span-2">
                آدرس: <span className="font-medium  text-zinc-700 text-wrap">
                <FarsiText>{saleAgent.address}</FarsiText></span>
            </p>
        </section>
  )
}

export default MinimalSaleAgentForm