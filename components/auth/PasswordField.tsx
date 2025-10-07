import { LockKeyhole, Eye, EyeOff } from "lucide-react"
import { UseFormRegister } from "react-hook-form"
import { ChangePasswordInputs } from "./ChangePasswordForm"

interface PasswordFieldProps {
  id: keyof ChangePasswordInputs
  label: string
  register: ReturnType<UseFormRegister<ChangePasswordInputs>>
  show: boolean
  toggle: () => void
  error?: string
  disabled?: boolean
}

const PasswordField = ({
  id,
  label,
  register,
  show,
  toggle,
  error,
  disabled,
}: PasswordFieldProps) => (
  <div>
    <div className="relative">
      <label
        htmlFor={id}
        className="absolute -top-3 right-3 bg-white px-2 rounded-xl text-sm text-[#696969] z-10"
      >
        <div className="flex gap-2 items-center">
            <LockKeyhole size={16} />
            {label}
        </div>
      </label>

      <input
        {...register}
        type={show ? "text" : "password"}
        id={id}
        className={`w-full border ${
        error ? "border-red-500" : "border-[#C3C3C3]"
        } rounded-2xl h-11 shadow-sm px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
        disabled={disabled}
      />

      <button
        type="button"
        onClick={toggle}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
        disabled={disabled}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>

    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)

export default PasswordField
