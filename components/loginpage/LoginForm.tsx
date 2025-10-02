"use client"

import Image from "next/image"
import Button from "../ui/Buttons"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useAuth } from "@/hooks/auth/useAuth"

type LoginFormInputs = {
  email: string
  password: string
  phoneNumber?: string
}


const LoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loginType, setLoginType] = useState<"phone-number" | "email">("email")

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormInputs>()

  const { login, loginStatus } = useAuth()
  const router = useRouter()

  const onSubmit = async (data: LoginFormInputs) => {
    const identifier = loginType === "email" ? data.email : data.phoneNumber!

    login(
      {email: identifier, password: data.password},
      {
        onSuccess: () => {
          toast.success("ورود موفقیت آمیز بود!")
          router.push("/chat")
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : "ورود با مشکل مواجه شد، دوباره تلاش کنید."
          toast.error(message)
        },
      }
    )
  }

  return ( 
    <section
      className="flex-1 flex items-center justify-center bg-white text-[#696969] px-6"
    >
      <div
        className="flex flex-col w-[446px]"
      >
        {/* Header */}
        <div
          className="flex flex-col gap-5 mb-6 self-center md:self-start"
        >
          <div
            className="flex items-center justify-center w-20 h-20 rounded-2xl"
          >
            <div
              className="w-16 h-16"
            >
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
          <h1
            className="text-black font-semibold"
          >
            Pika AI 05
          </h1>
        </div>

        {/* Login Form */}
        <form
          className="w-full flex flex-col gap-7"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email or Phone Number*/}
          <div
            className="relative w-full"
          >
            <label
              className="absolute -top-3 right-3 bg-white px-2 rounded-xl"
              htmlFor={loginType === "email" ? "email" : "phone-number"}
            >
              <AnimatePresence mode="wait">
                {loginType === "email" ? (
                  <motion.div
                    className="flex gap-2"
                    key="emailInput"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src="/icons/email-icon.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                    ایمیل
                  </motion.div>
                ) : (
                  <motion.div
                    className="flex gap-2"
                    key="phoneNumberInput"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src="/icons/phone-icon.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                    شماره موبایل
                  </motion.div>                
                )}
              </AnimatePresence>
            </label>
            <input 
              className="w-full border border-[#C3C3C3] rounded-2xl h-11 shadow-sm px-6"
              {...(loginType === "email"
                ? register("email", { required: "ایمیل را وارد کنید!" })
                : register("phoneNumber", { required: "شماره موبایل را وارد کنید!" })
              )}
              type={loginType === "email" ? "email" : "text"}
              name={loginType === "email" ? "email" : "phone-number"}
              id={loginType === "email" ? "email" : "phone-number"}
              required
            />
            {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>)}
            {errors.phoneNumber && (<p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>)}
          </div>

          {/* Password */}
          <div
            className="relative w-full"
          >
            <div>
              <label
                className="absolute -top-3 right-3 bg-white px-2 rounded-xl"
                htmlFor="password"
              >
                <div
                  className="flex gap-2"
                >
                  <Image 
                    src="/icons/lock-icon.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  رمز عبور
                </div>
              </label>              
              <input 
                className="w-full border border-[#C3C3C3] rounded-2xl h-11 shadow-sm px-6"
                {...register("password", { required: "رمز عبور را وارد کنید." })}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                required
              />
              {errors.password && (
                <p
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.password.message}
                </p>
              )}                
            </div>

            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5"
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
            >
              <Image
                className="object-cover"
                src={showPassword ? "/icons/hide-eye-icon.svg" : "/icons/eye-icon.svg"}
                alt=""
                width={17}
                height={12}
              />
            </button>
          </div>

          {/* Errors */}
          {loginStatus.isError && (
            <p
              className="text-red-600 text-sm font-medium"
            >
              {(loginStatus.error as Error)?.message}
            </p>
          )}

          {/* Submit Button */}
          <Button
            className={`${ loginStatus.isPending ? "cursor-not-allowed" : "" } shadow-md`}
            variant="primary"
            type="submit"
            disabled={loginStatus.isPending}
          >
            {loginStatus.isPending ? "در حال ورود" : "ورود"}
          </Button>
        </form>

        {/* Forgot Password & Login Type Toggle */}
        <div
          className="w-full flex justify-between px-1 mt-2"
        >
          <button
            className="text-[#696969] text-sm hover:text-black transition-colors"
          >
            فراموشی رمز عبور
          </button>

          <button
            className="text-[#696969] text-sm text-right hover:text-black transition-colors"
            type="button"
            onClick={() => setLoginType(loginType === "email" ? "phone-number" : "email")}
          >
            {loginType === "email" ? "ورود با شماره موبایل" : "ورود با ایمیل"}
          </button>
        </div>

        {/* Policy Agreement */}
        <div
          className="mt-9.5 self-center text-right"
        >
          <p
            className="text-sm text-center"
          >
          با ورود به هوش مصنوعی پیکاتک، شما قوانین و مقررات استفاده را می‌پذیرید.
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginForm