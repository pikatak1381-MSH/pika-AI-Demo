"use client"

import LoginGallery from "@/components/loginpage/LoginGallery"
import LoginForm from "@/components/loginpage/LoginForm"


const LoginPage = () => {
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