interface GmailLoginFormProps {
    signInHandler: () => void
}

const GmailLoginForm: React.FC<GmailLoginFormProps> = ({ signInHandler }) => {
  return (
    <button
        className="bg-blue-500 text-white hover:bg-blue-600 transition-colors rounded-[10px] w-full max-w-[446px] px-2 py-3 cursor-pointer"
        onClick={(e) => {
            e.preventDefault()
            signInHandler()
            }
        }
    type="button"
    >
    ورود با جی میل
    </button>
  )
}

export default GmailLoginForm