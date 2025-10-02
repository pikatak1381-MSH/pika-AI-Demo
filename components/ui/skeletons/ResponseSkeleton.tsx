import AnimatedContainer from "../AnimatedContainer"

const ResponseSkeleton = () => {
  return (
      <AnimatedContainer 
        className="relative w-full my-4 p-3 border-y-2 border-gray-200"
        variant="fade"
      >
        <div className="animate-pulse flex flex-col gap-3">
          <div className="h-4 w-32 bg-gray-300 rounded" />
          <div className="h-16 w-full bg-gray-200 rounded" />
          <div className="h-16 w-3/4 bg-gray-200 rounded" />
          <div className="h-10 w-28 bg-gray-300 rounded self-start" />
        </div>
      </AnimatedContainer>
  )
}

export default ResponseSkeleton