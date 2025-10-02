import { Skeleton } from "../ui/skeletons/Skeleton"

const InvoiceStepSkeleton = ({ step }: { step: number }) => {
  return (
    <div
        className="space-y-6"
    >
        {/* Step 1: Product Table */}
        {step === 1 && (
            <div>
                <Skeleton className="h-8 w-48"/>
                <div
                    className="space-y-2"
                >
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex gap-4"
                        >
                            <Skeleton className="h-12 flex-1"/>
                            <Skeleton className="h-12 w-20"/>
                            <Skeleton className="h-12 w-20"/>
                            <Skeleton className="h-12 w-20"/>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Step 2 & 3: Forms */}
        {(step === 2 || step === 3) && (
            <div
                className="grid grid-cols-2 gap-4"
            >
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        className="space-y-2"
                        key={i}
                    >   
                        <Skeleton className="h-4 w-24"/>
                        <Skeleton className="h-10 w-full"/>
                    </div>
                ))}
            </div>
        )}

        {/* Step 4: Preview */}
        <div>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    </div>
  )
}

export default InvoiceStepSkeleton