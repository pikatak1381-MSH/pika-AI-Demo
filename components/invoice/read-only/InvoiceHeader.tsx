import { getTodayJalali } from "@/lib/date"
import Image from "next/image"
import FarsiText from "../../ui/FarsiText"
import { useInvoiceStore } from "@/stores/useInvoiceStore"

const InvoiceHeader = () => {
  const { header } = useInvoiceStore()

  return (
    <header
      className="flex items-center justify-center gap-10"
    >
        <div
          className="w-1/3 h-auto"
        >
          <Image
              className="w-30 h-32 object-cover"
              src="/logos/saina-sanat-logo.png"
              alt="Saina Sanat Paya's Logo"
              width={120}
              height={128}
              priority
          />
        </div>
        <h2
          className="w-1/3 flex items-start justify-center font-bold text-lg text-center text-nowrap"
        >
          پیش‌ فاکتور کالا و خدمات
        </h2>
        <div
          className="w-1/3 flex flex-col items-end justify-center gap-5"
        >
          <p className="w-full flex justify-center items-center gap-2 text-nowrap text-sm">
            شماره پیش فاکتور: 
            <span className="font-semibold text-sm"></span>
          </p>

          <p className="w-full flex justify-center items-center gap-2 text-nowrap text-sm">
            تاریخ: 
            <span className="font-semibold text-sm"><FarsiText>{header.date = getTodayJalali()}</FarsiText></span>
          </p>
        </div>
    </header>
  )
}

export default InvoiceHeader