"use client"

import Image from "next/image"
import Button from "../ui/Buttons"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useAuth } from "@/hooks/auth/useAuth"
import Link from "next/link"
import { LockKeyhole, Mail, Phone, Eye, EyeOff } from "lucide-react"

type SignUpFormInputs = {
  fullName: string
  identifier: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [signUpType, setSignUpType] = useState<"phone-number" | "email">("email")

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<SignUpFormInputs>()

    const { signUp, signUpStatus } = useAuth()
    const router = useRouter()

    const password = watch("password")

    const onSubmit = async (data: SignUpFormInputs) => {
        /* if (!data.agreeToTerms) {
            toast.error("لطفا قوانین و مقررات را بپذیرید")
            return
        } */

        signUp(
            { 
                fullName: data.fullName,
                email: data.identifier, 
                password: data.password 
            },
            {
                onSuccess: () => {
                    toast.success("ثبت نام با موفقیت انجام شد!")
                    router.push("/chat")
                },
                onError: (error: unknown) => {
                    const message = error instanceof Error 
                        ? error.message 
                        : "ثبت نام با مشکل مواجه شد، دوباره تلاش کنید."
                    toast.error(message)
                },
            }
    )
  }

  const isLoading = signUpStatus?.isPending || isSubmitting

  return ( 
    <section className="flex-1 flex items-center justify-center bg-white text-[#696969] px-6 py-8">
      <div className="flex flex-col w-full max-w-[446px]">
        {/* Header */}
        <div className="flex flex-col gap-5 mb-6 self-center md:self-start">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl">
            <div className="w-16 h-16">
              <Image
                className="object-cover"
                src="/logos/pika-ai-logo.png"
                alt="Pika AI Logo"
                width={63}
                height={62}
                priority
              />
            </div>
          </div>
          <div>
            <h1 className="text-black font-semibold text-2xl">
              Pika AI 05
            </h1>
            <p className="text-sm text-[#696969] mt-1">
              ساخت حساب کاربری جدید
            </p>
          </div>
        </div>

        {/* SignUp Form */}
        <form
          className="w-full flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Full Name */}
          <div className="relative w-full">
            <label
              className="absolute -top-3 right-3 bg-white px-2 rounded-xl z-10"
              htmlFor="fullName"
            >
              <div className="flex gap-2 items-center">
                <Image
                  src="/icons/user-icon.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                نام و نام خانوادگی
              </div>
            </label>
            <input 
              className={`w-full border ${errors.fullName ? 'border-red-500' : 'border-[#C3C3C3]'} rounded-2xl h-11 shadow-sm px-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              {...register("fullName", { 
                required: "نام و نام خانوادگی را وارد کنید!",
                minLength: {
                  value: 3,
                  message: "نام باید حداقل 3 کاراکتر باشد"
                }
              })}
              type="text"
              id="fullName"
              placeholder="علی احمدی"
              aria-invalid={errors.fullName ? "true" : "false"}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              disabled={isLoading}
            />
            {errors.fullName && (
              <p 
                id="fullName-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email or Phone Number */}
          <div className="relative w-full">
            <label
              className="absolute -top-3 right-3 bg-white px-2 rounded-xl z-10"
              htmlFor="identifier"
            >
              <AnimatePresence mode="wait">
                {signUpType === "email" ? (
                  <motion.div
                    className="flex gap-2 items-center"
                    key="emailLabel"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Mail size={20}/>
                    ایمیل
                  </motion.div>
                ) : (
                  <motion.div
                    className="flex gap-2 items-center"
                    key="phoneLabel"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Phone size={20} />
                    شماره موبایل
                  </motion.div>                
                )}
              </AnimatePresence>
            </label>
            <input 
              className={`w-full border ${errors.identifier ? 'border-red-500' : 'border-[#C3C3C3]'} rounded-2xl h-11 shadow-sm px-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              {...register("identifier", { 
                required: signUpType === "email" 
                  ? "ایمیل را وارد کنید!" 
                  : "شماره موبایل را وارد کنید!",
                pattern: signUpType === "email" 
                  ? {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "فرمت ایمیل نامعتبر است"
                    }
                  : {
                      value: /^09\d{9}$/,
                      message: "شماره موبایل باید با 09 شروع شود و 11 رقم باشد"
                    }
              })}
              type={signUpType === "email" ? "email" : "tel"}
              id="identifier"
              placeholder={signUpType === "email" ? "example@email.com" : "09123456789"}
              aria-invalid={errors.identifier ? "true" : "false"}
              aria-describedby={errors.identifier ? "identifier-error" : undefined}
              disabled={isLoading}
            />
            {errors.identifier && (
              <p 
                id="identifier-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative w-full">
            <label
              className="absolute -top-3 right-3 bg-white px-2 rounded-xl z-10"
              htmlFor="password"
            >
              <div className="flex gap-2 items-center">
                <LockKeyhole size={20}/>
                رمز عبور
              </div>
            </label>              
            <input 
              className={`w-full border ${errors.password ? 'border-red-500' : 'border-[#C3C3C3]'} rounded-2xl h-11 shadow-sm px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              {...register("password", { 
                required: "رمز عبور را وارد کنید.",
                minLength: {
                  value: 8,
                  message: "رمز عبور باید حداقل 8 کاراکتر باشد"
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد"
                }
              })}
              type={showPassword ? "text" : "password"}
              id="password"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={isLoading}
            />
            {errors.password && (
              <p
                id="password-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}

            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
              disabled={isLoading}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative w-full">
            <label
              className="absolute -top-3 right-3 bg-white px-2 rounded-xl z-10"
              htmlFor="confirmPassword"
            >
              <div className="flex gap-2 items-center">
                <LockKeyhole size={20} />
                تکرار رمز عبور
              </div>
            </label>              
            <input 
              className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-[#C3C3C3]'} rounded-2xl h-11 shadow-sm px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              {...register("confirmPassword", { 
                required: "تکرار رمز عبور را وارد کنید.",
                validate: (value) => value === password || "رمز عبور و تکرار آن مطابقت ندارند"
              })}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.confirmPassword.message}
              </p>
            )}

            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              aria-label={showConfirmPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
              disabled={isLoading}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Terms Agreement Checkbox */}
          {/* <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agreeToTerms"
              className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer"
              {...register("agreeToTerms", {
                required: "باید قوانین و مقررات را بپذیرید"
              })}
              disabled={isLoading}
            />
            <label 
              htmlFor="agreeToTerms" 
              className="text-sm text-[#696969] cursor-pointer select-none"
            >
              قوانین و مقررات استفاده از هوش مصنوعی پیکاتک را مطالعه کرده و می‌پذیرم.
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-red-500 text-sm -mt-3" role="alert">
              {errors.agreeToTerms.message}
            </p>
          )} */}

          {/* Submit Button */}
          <Button
            className={`${isLoading ? "cursor-not-allowed opacity-70" : ""} shadow-md mt-2`}
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "در حال ثبت نام..." : "ثبت نام"}
          </Button>
        </form>

        {/* SignUp Type Toggle & Login Link */}
        <div className="w-full flex justify-between px-1 mt-3">
          <Link
            href="/login"
            className="text-[#696969] text-sm hover:text-black transition-colors"
          >
            قبلا ثبت نام کرده‌اید؟ ورود
          </Link>

          <button
            className="text-[#696969] text-sm text-right hover:text-black transition-colors disabled:opacity-50"
            type="button"
            onClick={() => setSignUpType(signUpType === "email" ? "phone-number" : "email")}
            disabled={isLoading}
          >
            {signUpType === "email" ? "ثبت نام با شماره موبایل" : "ثبت نام با ایمیل"}
          </button>
        </div>
      </div>
    </section>
  )
}

export default SignUpForm