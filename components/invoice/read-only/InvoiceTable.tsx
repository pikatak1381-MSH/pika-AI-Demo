import { useInvoiceStore } from "@/stores/useInvoiceStore"
import FarsiThousandSeperator from "../../ui/FarsiThousandSeperator"
import InvoiceDivider from "./InvoiceDivider"


const InvoiceTable = () => {
    const { selectedProducts } = useInvoiceStore()

    return (
        <section className="rounded-b-md">
            <InvoiceDivider
                className="rounded-t-md rounded-b-none py-3 mb-0 border-0 mt-4"
            >
                مشخصات کالا یا خدمات مورد معامله
            </InvoiceDivider>
            <table
                className="w-full"
            >
                <thead
                    className="text-sm text-nowrap"
                >
                    <tr
                        className="bg-gray-200"
                    >
                        <td className="border text-center px-3 py-4">ردیف</td>
                        <td className="border text-center px-3 py-4">شرح کالا‌/‌خدمات</td>
                        <td className="border text-center px-3 py-4">تعداد</td>
                        <td className="border text-center px-3 py-4">مبلغ واحد (ریال)</td>
                        <td className="border text-center px-3 py-4">مبلغ کل (ریال)</td>
                        <td className="border text-center px-3 py-4">تخفیف</td>
                        <td className="border text-center px-3 py-4">جمع مبلغ نهایی (ریال)</td>
                    </tr>
                </thead>
                <tbody>
                    {selectedProducts.map((product, index) => (
                        <tr
                            key={index}
                        >
                            {/* Row Number */}
                            <td className="border text-center py-4 text-sm">
                                <FarsiThousandSeperator value={index + 1} />
                            </td>

                            {/* Product Name */}
                            <td className="border text-center py-4 px-1 text-sm">
                                <p
                                    className="font-bold text-sm mb-1"
                                >
                                    {product.name}
                                </p>
                                <div>
                                    {product.selectedSpecifications?.map((s, i) => (
                                        <span key={i} className="px-1 text-xs">{s.AttributeName}: {s.Value} / </span>
                                    ))}
                                </div>
                            </td>

                            {/* Quantity */}
                            <td className="border text-center py-4 text-sm">
                                <FarsiThousandSeperator value={product.quantity} />
                            </td>

                            {/* Per Unit Price */}
                            <td className="border text-center py-4 text-sm">
                                <FarsiThousandSeperator value={product.original_price} />
                            </td>

                            {/* Total Price */}
                            <td className="border text-center py-4 text-sm">
                                <FarsiThousandSeperator value={product.original_price * product.quantity} />
                            </td>

                            {/* Discount */}
                            <td className="border text-center px-1 py-4 text-sm">
                                <FarsiThousandSeperator value={product.discount} />
                            </td>

                            {/* Final Price after Discount */}
                            <td className="border text-center py-4 text-sm">
                                <FarsiThousandSeperator value={(product.original_price * product.quantity) - (product.discount)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
  )
}

export default InvoiceTable