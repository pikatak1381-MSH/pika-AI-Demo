"use client"

import LoginGallery from "@/components/loginpage/LoginGallery"
import LoginForm from "@/components/loginpage/LoginForm"
import { useAuth } from "@/hooks/auth/useAuth"
import { AuthLoadingScreen } from "@/components/auth/AuthLoadingScreen"


const LoginPage = () => {
  const { isHydrated } = useAuth({
    redirectIfAuthenticated: "/chat"
  })

  if (!isHydrated) {
    return <AuthLoadingScreen />
  }

  return (
      <section
        className="w-full h-screen flex bg-white"
      >
        <LoginForm />
        <LoginGallery />
      </section>
  )
}

export default LoginPage