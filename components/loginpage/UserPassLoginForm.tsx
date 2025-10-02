"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { handleLogin } from "@/lib/api"
import Button from "../ui/Buttons"
import AnimatedContainer from "../ui/AnimatedContainer"


const UserPassLoginForm = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const router = useRouter()

    /* Handling username and password submit */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        try {
            const res = await handleLogin(email, password)

            if (!res.ok) {
                const errData = await res.json()
                setError(errData.message || "Failed to Login")
                return
            }

            const data = await res.json()
            const token = data.token || data.session_token
            const userId = data.user_id
            
            localStorage.setItem("token", token)
            localStorage.setItem("userId", userId)
            router.push("/chat")
        } catch (error) {
            setError("مشکل در اتصال")
            console.error(error)
        }
    }


  return (
    <AnimatedContainer
        variant="zoom"
        className="w-full"
    >
        <form
            className="w-full flex flex-col gap-6 items-center justify-center"
            onSubmit={handleSubmit}
        >
            <div
                className="w-full flex flex-col justify-center items-center gap-2"
            >
                <div
                    className="w-full flex justify-start items-center rounded-2xl bg-[#1f1f1f] max-w-sm px-2 py-2 gap-2"
                >
                    <label className="text-nowrap text-[1.125rem] font-semibold" htmlFor="email">ایمیل</label>
                        <div
                            className="w-full flex items-center justify-between"
                        >
                            <input 
                                className="w-full max-w-[205px] mx-7 px-2 py-1 bg-black/50" 
                                type="email" 
                                id="email" 
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                            <Image
                                className="w-6 h-6 bg-white rounded-lg"
                                src="/icons/user-icon.svg"
                                alt=""
                                width={24}
                                height={24}
                            />                        
                        </div>
                </div>

                <div
                    className="w-full flex justify-start items-center rounded-2xl bg-[#1f1f1f] max-w-sm px-2 py-2"
                >
                    <label className="text-nowrap text-[1.125rem] font-semibold" htmlFor="password">رمز عبور</label>
                    <div
                        className="w-full flex items-center gap-2"
                    >
                        <input 
                            className="w-full max-w-[220px] mx-7 px-2 py-1 bg-black/50" 
                            type={showPassword ? "text" : "password"}
                            id="password" 
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            />
                            <button
                                className=""
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                <Image
                                    className="w-9 h-6 bg-white rounded-lg"
                                    src={showPassword ? "/icons/eye-icon.svg" : "/icons/hide-eye-icon.svg"}
                                    alt=""
                                    width={36}
                                    height={24}
                                />
                            </button>
                        <Image
                            className="w-6 h-6 bg-white rounded-lg"
                            src="/icons/key-icon.svg"
                            alt=""
                            width={24}
                            height={24}
                        />
                    </div>
                </div>
                    {error && (
                        <p className="text-red-500">{error}</p>
                    )}
                <Button
                    variant="primary"
                    type="submit"
                >
                    ورود
                </Button>
            </div>
        </form>
    </AnimatedContainer>
  )
}

export default UserPassLoginForm