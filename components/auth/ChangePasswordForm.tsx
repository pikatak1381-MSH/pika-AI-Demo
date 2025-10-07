"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useChangePassword } from "@/hooks/auth/useChangePassword"
import PasswordField from "./PasswordField"

export type ChangePasswordInputs = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

interface ChangePasswordFormProps {
    onSuccess?: () => void
    onCancel?: () => void
}

const ChangePasswordForm = ({ onSuccess, onCancel }: ChangePasswordFormProps) => {
    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordInputs>()

    const newPassword = watch("newPassword")

    const { changePassword, isLoading } = useChangePassword({
        onSuccess: (data) => {
            toast.success(data.message || "رمز عبور با موفقیت تغییر یافت")
            reset()
            onSuccess?.()
        },
        onError: (error) => {
            toast.error(error.message || "تغییر رمز عبور با مشکل مواجه شد")
        }
    })

    const onSubmit = (data: ChangePasswordInputs) => {
        changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        })
    }

    // Password Strength Indicator
    const getPasswordStrength = (password: string): number => {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[^a-zA-Z\d]/.test(password)) strength++
        return strength
    }

    const passwordStrength = newPassword ? getPasswordStrength(newPassword) : 0

    const getStrengthColor = (strength: number): string => {
        if (strength <= 2) return "bg-red-500"
        if (strength === 3) return "bg-yellow-500"
        if (strength === 4) return "bg-blue-500"
        return "bg-green-500"
    }

    const getStrengthText = (strength: number): string => {
        if (strength <= 2) return "ضعیف"
        if (strength === 3) return "متوسط"
        if (strength === 4) return "خوب"
        return "عالی"
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Current Password */}
                <PasswordField 
                    id="currentPassword"
                    label="رمز عبور فعلی"
                    register={register("currentPassword", { required: "رمز عبور فعلی را وارد کنید" })}
                    show={show.current}
                    toggle={() => setShow({ ...show, current: !show.current })}
                    error={errors.currentPassword?.message}
                    disabled={isLoading}
                />

                {/* New Password */}
                <PasswordField 
                    id="newPassword"
                    label="رمز عبور جدید"
                    register={register("newPassword", {
                        required: "رمز عبور جدید را وارد کنید",
                        minLength: { value: 8, message: "حداقل 8 کاراکتر" },
                        pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                        message: "باید شامل حروف بزرگ، کوچک و عدد باشد",
                        },
                        validate: (v) =>
                        v !== watch("currentPassword") || "رمز عبور جدید نباید با رمز فعلی یکسان باشد",
                    })}
                    show={show.new}
                    toggle={() => setShow({ ...show, new: !show.new })}
                    error={errors.newPassword?.message}
                    disabled={isLoading}                    
                />

                {/* Password Strength Indicator */}
                {newPassword && !errors.newPassword && (
                    <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                            <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${
                                i < passwordStrength ? getStrengthColor(passwordStrength) : "bg-gray-200"
                            }`}
                            />
                        ))}
                        </div>
                        <p className="text-xs text-gray-600">
                        قدرت رمز عبور: {getStrengthText(passwordStrength)}
                        </p>
                    </div>
                )}

                {/* Confirm Password */}
                <PasswordField 
                    id="confirmPassword"
                    label="تکرار رمز عبور جدید"
                    register={register("confirmPassword", {
                        required: "تکرار رمز عبور را وارد کنید",
                        validate: (v) => v === newPassword || "رمز عبور و تکرار آن مطابقت ندارند",
                    })}
                    show={show.confirm}
                    toggle={() => setShow({ ...show, confirm: !show.confirm })}
                    error={errors.confirmPassword?.message}
                    disabled={isLoading}                    
                />

                {/* Password Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                        الزامات رمز عبور:
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1">
                    <li className="flex items-center gap-2">
                        <span className={newPassword?.length >= 8 ? "text-green-600" : ""}>
                        {newPassword?.length >= 8 ? "✓" : "•"}
                        </span>
                        حداقل 8 کاراکتر
                    </li>
                    <li className="flex items-center gap-2">
                        <span className={/[a-z]/.test(newPassword || "") ? "text-green-600" : ""}>
                        {/[a-z]/.test(newPassword || "") ? "✓" : "•"}
                        </span>
                        حداقل یک حرف کوچک
                    </li>
                    <li className="flex items-center gap-2">
                        <span className={/[A-Z]/.test(newPassword || "") ? "text-green-600" : ""}>
                        {/[A-Z]/.test(newPassword || "") ? "✓" : "•"}
                        </span>
                        حداقل یک حرف بزرگ
                    </li>
                    <li className="flex items-center gap-2">
                        <span className={/\d/.test(newPassword || "") ? "text-green-600" : ""}>
                        {/\d/.test(newPassword || "") ? "✓" : "•"}
                        </span>
                        حداقل یک عدد
                    </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex-1 bg-blue-600 text-white rounded-2xl h-11 font-medium shadow-md hover:bg-blue-700 transition-colors ${
                            isLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                    {isLoading ? "در حال تغییر..." : "تغییر رمز عبور"}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1 bg-gray-200 text-gray-700 rounded-2xl h-11 font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                        >
                            انصراف
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default ChangePasswordForm