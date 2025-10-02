import Image from "next/image"

const Stepper = ({ step }: { step: number }) => {
    const steps = [
        { step: "محصول", icon: "/icons/blue-product-icon.svg", activeIcon: "/icons/blue-product-hovored-icon.svg", completeIcon: "/icons/blue-product-clicked-icon.svg" },
        { step: "انتخاب فروشنده و خریدار", icon: "/icons/blue-seller-icon.svg", activeIcon: "/icons/blue-seller-hovored-icon.svg", completeIcon: "/icons/blue-seller-clicked-icon.svg" },
        { step: "صدور پیش فاکتور", icon: "/icons/blue-invoice-icon.svg", activeIcon: "/icons/blue-invoice-hovored-icon.svg", completeIcon: "/icons/blue-invoice-clicked-icon.svg" },
    ]

    const totalSegments = steps.length - 1
    const completedSegments = Math.min(Math.max(step, 0), totalSegments)
    const fillPercent = (completedSegments / totalSegments) * 100

return (
    <div
        className="py-1 px-12"
    >
        {/* Circles row + Lines */}
        <div
            className="relative h-9"
        >
            {/* Background gray line */}
            <div 
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0"
            />

            {/* Filled blue line from right to left */}
            <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 z-0 transition-all duration-300"
                style={{ width: `${fillPercent}%` }}
            />

            {/* Circles */}
            <div
                className="w-full flex justify-between items-center"
            >
                {steps.map((label, index) => (
                    <div
                        className="text-center z-10"
                        key={label.step}
                    >
                        <div
                            className="w-9 h-9 rounded-full"
                        >
                            {index > step && (
                                <Image
                                    className="w-9 h-9 object-cover"
                                    src={label.icon}
                                    alt=""
                                    width={36}
                                    height={36}
                                />
                            )}

                            {index === step && (
                                <Image
                                    className="w-9 h-9 object-cover"
                                    src={label.activeIcon}
                                    alt=""
                                    width={36}
                                    height={36}
                                />
                            )}

                            {index < step && (
                                <Image
                                    className="w-9 h-9 object-cover"
                                    src={label.completeIcon}
                                    alt=""
                                    width={36}
                                    height={36}
                                />
                            )}
                        </div>
                    </div>
                    ))}                
            </div>
        </div>

        {/* Labels */}
        <div
            className="mt-2 flex-1 flex items-center justify-between"
        >
            {steps.map((label, index) => (
                <div
                    className="w-full -mx-1 font-medium"
                    key={`${label.step}-label`}
                >
                    {index === 0 && (
                        <p
                            className={`text-sm text-start`}
                        >
                            {label.step}
                        </p>
                    )}
                    {index === 1 && (
                        <p
                            className={`text-sm text-center`}
                        >
                            {label.step}
                        </p>
                    )}
                    {index === 2 && (
                        <p
                            className={`text-sm text-end`}
                        >
                            {label.step}
                        </p>
                    )}
                </div>

            ))}
        </div>
    </div>
  )
}

export default Stepper