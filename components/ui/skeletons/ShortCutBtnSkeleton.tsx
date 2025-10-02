const SkeletonBtns = () => {
    return (
        <div
            className="flex items-center rounded-xl bg-gray-200 w-28 h-9"
        ></div>
    )
}

const ShortCutBtnSkeleton = () => {
  return (
    <div
        className="flex space-x-5.5 mt-8"
    >
        {Array.from({ length: 4 }).map((_,i) => (
            <SkeletonBtns key={i}/>
        ))}
    </div>
  )
}

export default ShortCutBtnSkeleton