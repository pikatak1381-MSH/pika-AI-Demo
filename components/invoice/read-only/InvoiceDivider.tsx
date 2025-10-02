import clsx from "clsx"

interface InvoiceDividerProps {
    children: React.ReactNode
    className?: string
}

const InvoiceDivider: React.FC<InvoiceDividerProps> = ({children, className, }) => {
    const baseStyle = "w-full flex items-center justify-center bg-gray-300 rounded-md p-1 mt-2"

  return (
    <div
        className={clsx(baseStyle, className)}
    >
        <h3
            className="font-bold text-center text-sm text-black"
        >
            {children}
        </h3>
    </div>
  )
}

export default InvoiceDivider