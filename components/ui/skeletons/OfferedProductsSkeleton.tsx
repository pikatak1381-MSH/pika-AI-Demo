import { Skeleton } from "./Skeleton"

const TableRow = () => {
  return (
    <Skeleton
      className="w-full h-14 bg-gray-100 rounded-lg flex items-center px-4 gap-4"
    >
      <div className="w-full max-w-4 h-4 border border-gray-300 rounded"></div>
      <div className="w-full max-w-64 h-4 bg-gray-300 rounded-xl"></div>
      <div className="w-full max-w-16 h-8 bg-gray-300 rounded-xl"></div>
      <div className="w-full max-w-44 h-10 bg-gray-300 rounded-xl"></div>
      <div className="w-full max-w-35 h-4 border bg-gray-200 rounded-lg"></div>
    </Skeleton>
  )
}

const FeedbackBtn = () => {
  return (
    <div className="w-6 h-6 rounded-full bg-white"></div>
  )
}

const OfferedProductsSkeleton = () => {
  return (
        <div
          className="w-full max-w-4xl flex flex-col py-4 gap-6 border-y border-gray-200"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <TableRow key={i} />
          ))}

          {/* Buttons */}
          <div
            className="flex items-center gap-4"
          >
            <div className="w-40 h-10 bg-gray-300 rounded-lg"></div>
            <div className="w-40 h-10 bg-gray-300 rounded-lg"></div>
          </div>

          {/* Feedback Buttons */}
          <div
            className="flex items-center gap-2"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <FeedbackBtn key={i} />
            ))}
          </div>
        </div>
  )
}

export default OfferedProductsSkeleton