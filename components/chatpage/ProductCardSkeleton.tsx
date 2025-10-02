import { Skeleton } from "../ui/skeletons/Skeleton"

const ProductCardSkeleton = () => {
  return (
    <div
        className="border rounded-lg p-4 space-y-3"
    >
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div
            className="flex justify-between items-center"
        >
            <Skeleton className="h-8 w-20"/>
            <Skeleton className="h-10 w-24"/>
        </div>
    </div>
  )
}

export default ProductCardSkeleton