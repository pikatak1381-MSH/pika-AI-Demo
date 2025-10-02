import React from 'react'

const OutroTextSkeleton = () => {
  return (
    <div
        className="w-full flex flex-col gap-4"
    >
        <div className="w-full max-w-2xl h-4 bg-gray-300 rounded-xl"></div>
        <div className="w-full max-w-46 h-4 bg-gray-300 rounded-xl"></div>
    </div>
  )
}

export default OutroTextSkeleton