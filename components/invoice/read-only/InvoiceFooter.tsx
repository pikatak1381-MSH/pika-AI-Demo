import FarsiText from "../../ui/FarsiText"
import { useInvoiceStore } from "@/stores/useInvoiceStore"
import FarsiThousandSeperator from "../../ui/FarsiThousandSeperator"

const InvoiceFooter = () => {
    const { footer } = useInvoiceStore()


    return (
        <section
            className="w-full flex items-center justify-between my-6"
        >
            <div
                className="text-xs font-semibold leading-loose"
            >
                <FarsiText>
                    <h4>ملاحظات:</h4>
                    <p className="pr-2">
                    اجناس فروخته‌شده تعویض یا مرجوعی ندارند.<br />
                    اعتبار: 1 روز پس از صدور<br />
                    در فاکتور رسمی کلیه کسورات قانونی اعم از مالیات بر ارزش افزوده و غیره بر عهده مشتری می باشد.<br />
                    زمان تحویل کالا 2 تا 84 ساعت کاری می باشد.
                    </p>           
                </FarsiText>
            </div>
            <div
                className="p-1 border"
            >
                <table>
                    <tbody
                        className="border text-sm"
                    >
                        <tr>
                            <td className="border p-2">تخفیف کل (ریال)</td>
                            <td className="border p-2">
                                <FarsiThousandSeperator 
                                    value={footer.totalDiscount}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border p-2">مجموع با تخفیف (ریال)</td>
                            <td className="border p-2">
                                <FarsiThousandSeperator 
                                    value={footer.totalAfterDiscount}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border p-2">مالیات (ریال)</td>
                            <td className="border p-2">
                                <FarsiThousandSeperator 
                                    value={footer.invoiceTax}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border p-2">جمع کل (ریال)</td>
                            <td className="border p-2">
                                <FarsiThousandSeperator 
                                    value={footer.totalAfterDiscount}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default InvoiceFooter