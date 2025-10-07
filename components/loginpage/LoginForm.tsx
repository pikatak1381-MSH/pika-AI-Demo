"use client"

import Image from "next/image"
import Button from "../ui/Buttons"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useAuth } from "@/hooks/auth/useAuth"
import { Eye, EyeOff, LockKeyhole, Mail, Phone } from "lucide-react"

type LoginFormInputs = {
  identifier: string
  password: string
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loginType, setLoginType] = useState<"phone-number" | "email">("email")

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormInputs>()

  const { login, loginStatus } = useAuth()
  const router = useRouter()

  const onSubmit = async (data: LoginFormInputs) => {
    login(
      { email: data.identifier, password: data.password },
      {
        onSuccess: () => {
          toast.success("ورود موفقیت آمیز بود!")
          router.push("/chat")
        },
        onError: (error: unknown) => {
          const message = error instanceof Error 
            ? error.message 
            : "ورود با مشکل مواجه شد، دوباره تلاش کنید."
          toast.error(message)
        },
      }
    )
  }

  const isLoading = loginStatus.isPending || isSubmitting

  return ( 
    <section
      className="flex-1 flex items-center justify-center bg-white text-[#696969] px-6"
    >
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
          <h1 className="text-black font-semibold text-2xl">
            Pika AI 05
          </h1>
        </div>

        {/* Login Form */}
        <form
          className="w-full flex flex-col gap-7"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Email or Phone Number */}
          <div className="relative w-full">
            <label
              className="absolute -top-3 right-3 bg-white px-2 rounded-xl z-10"
              htmlFor="identifier"
            >
              <AnimatePresence mode="wait">
                {loginType === "email" ? (
                  <motion.div
                    className="flex gap-2 items-center"
                    key="emailLabel"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Mail size={20} />
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
                required: loginType === "email" 
                  ? "ایمیل را وارد کنید!" 
                  : "شماره موبایل را وارد کنید!",
                pattern: loginType === "email" 
                  ? {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "فرمت ایمیل نامعتبر است"
                    }
                  : {
                      value: /^09\d{9}$/,
                      message: "شماره موبایل باید با 09 شروع شود و 11 رقم باشد"
                    }
              })}
              type={loginType === "email" ? "email" : "tel"}
              id="identifier"
              placeholder={loginType === "email" ? "example@email.com" : "09123456789"}
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
                <LockKeyhole size={20} />
                رمز عبور
              </div>
            </label>              
            <input 
              className={`w-full border ${errors.password ? 'border-red-500' : 'border-[#C3C3C3]'} rounded-2xl h-11 shadow-sm px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              {...register("password", { 
                required: "رمز عبور را وارد کنید.",
                minLength: {
                  value: 6,
                  message: "رمز عبور باید حداقل 6 کاراکتر باشد"
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

          {/* Submit Button */}
          <Button
            className={`${isLoading ? "cursor-not-allowed opacity-70" : ""} shadow-md`}
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "در حال ورود..." : "ورود"}
          </Button>
        </form>

        {/* Forgot Password & Login Type Toggle */}
        <div className="w-full flex justify-between px-1 mt-2">
          <button
            className="text-[#696969] text-sm hover:text-black transition-colors disabled:opacity-50"
            type="button"
            disabled={isLoading}
          >
            فراموشی رمز عبور
          </button>

          <button
            className="text-[#696969] text-sm text-right hover:text-black transition-colors disabled:opacity-50"
            type="button"
            onClick={() => setLoginType(loginType === "email" ? "phone-number" : "email")}
            disabled={isLoading}
          >
            {loginType === "email" ? "ورود با شماره موبایل" : "ورود با ایمیل"}
          </button>
        </div>

        {/* Policy Agreement */}
        <div className="mt-10 self-center text-center">
          <p className="text-sm text-[#696969]">
            با ورود به هوش مصنوعی پیکاتک، شما قوانین و مقررات استفاده را می‌پذیرید.
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginForm