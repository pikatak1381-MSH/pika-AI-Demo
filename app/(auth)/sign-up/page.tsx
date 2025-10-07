"use client"

import SignUpForm from "@/components/signup-page/SignUpForm"
import LoginGallery from "@/components/loginpage/LoginGallery"

const SignUpPage = () => {
  return (
    <section className="w-full h-screen flex bg-white">
      <SignUpForm />
      <LoginGallery />
    </section>
  )
}

export default SignUpPage