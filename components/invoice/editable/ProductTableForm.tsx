import InvoiceDivider from "../read-only/InvoiceDivider"
import { useInvoiceStore } from "@/stores/useInvoiceStore"
import FarsiInput from "../../ui/FarsiInput"
import FarsiThousandSeperator from "../../ui/FarsiThousandSeperator"
import FarsiText from "../../ui/FarsiText"


const ProductTableForm = () => {
    const { selectedProducts, updateProduct, addSpecification, removeSpecification } = useInvoiceStore()

  return (
    <section className="rounded-b-md">
        <InvoiceDivider
            className="rounded-t-md rounded-b-none py-3 mb-0 border-0"
        >
            مشخصات کالا یا خدمات مورد معامله
        </InvoiceDivider>
        <table
            className="w-full rounded-b-m bg-[#DFDFDF]"
        >
            <thead
                className="text-sm text-nowrap"
            >
                <tr
                    className="bg-[#EEEEEE]"
                >
                    <td className="border border-white text-center px-3 py-4">ردیف</td>
                    <td className="border border-white text-center px-3 py-4">شرح کالا‌/‌خدمات</td>
                    <td className="border border-white text-center px-3 py-4">تعداد</td>
                    <td className="border border-white text-center px-3 py-4">مبلغ واحد (ریال)</td>
                    <td className="border border-white text-center px-3 py-4">مبلغ کل (ریال)</td>
                    <td className="border border-white text-center px-3 py-4">تخفیف</td>
                    <td className="border border-white text-center px-3 py-4">جمع مبلغ نهایی (ریال)</td>
                </tr>
            </thead>
            <tbody>
                {selectedProducts.map((product, index) => (
                    <tr
                        key={index}
                        style={{
                            backgroundColor: index % 2 === 0 ? "#E4E4E7" : "#EEEEEE"
                        }}
                    >
                        {/* Row Number */}
                        <td className="border border-white text-center py-4 text-sm"><FarsiText>{index + 1}</FarsiText></td>

                        {/* Product Name */}
                        <td className="border border-white text-center py-4 px-2 max-w-xs">
                            <p className="font-bold text-sm mb-1">{product.name}</p>

                            <div
                                className="flex flex-wrap justify-start items-center py-2 gap-2 text-sm w-fit"
                            >
                                {product.specifications.map((spec, i) => (
                                    <label
                                        className="flex flex-wrap gap-2 bg-gray-50 border border-white rounded-md p-1 shadow-sm text-xs cursor-pointer"
                                        key={i}
                                    >
                                        <input 
                                            type="checkbox"
                                            checked={
                                                selectedProducts.some(
                                                    (p) =>
                                                        p.id === product.id &&
                                                        p.selectedSpecifications?.some(
                                                            (s) =>
                                                                s.AttributeName === spec.AttributeName &&
                                                                s.Value === spec.Value
                                                        )
                                                )
                                            }
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    addSpecification(product.id, spec)
                                                } else {
                                                    removeSpecification(product.id, spec)
                                                }
                                            }}
                                        />
                                        <span className="text-black font-bold text-nowrap">
                                            {spec.AttributeName}:
                                        </span>
                                        <span className="text-zinc-900 text-nowrap">
                                            {spec.Value}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </td>

                        {/* Quantity */}
                        <td className="border border-white text-center py-4 text-sm">
                            <FarsiInput
                                className="w-12 bg-white text-center p-1 mx-1"
                                min={1}
                                value={product.quantity}
                                onChange={(val) => updateProduct(product.id, { quantity: val })
                                }
                                required
                            />
                        </td>

                        {/* Per Unit Price */}
                        <td className="border border-white text-center py-4 text-sm">
                            <FarsiInput 
                                className="max-w-24 bg-white text-center p-1 mx-1"
                                value={product.original_price}
                                onChange={(val) => updateProduct(product.id, { original_price: val })}
                            />
                        </td>

                        {/* Total Price */}
                        <td className="border border-white text-center py-4 text-sm">
                            <FarsiThousandSeperator 
                                value={product.original_price * product.quantity}
                            />
                        </td>

                        {/* Discount */}
                        <td className="border border-white text-center py-4 text-sm">
                            <FarsiInput 
                                className="max-w-16 bg-white text-center p-1 mx-1"
                                type="text"
                                value={product.discount}
                                onChange={(val) => 
                                    updateProduct(product.id, { discount: val })
                                }
                            />
                        </td>

                        {/* Final Price after Discount */}
                        <td className="border border-white text-center py-4 text-sm">
                            <FarsiThousandSeperator value={(product.quantity * product.original_price) - (product.discount)}/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </section>
  )
}

export default ProductTableForm