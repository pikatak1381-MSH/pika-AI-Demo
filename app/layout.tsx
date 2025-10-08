import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import Providers from "./Providers"
import { Toaster } from "@/components/ui/sonner"
import { ModalsHost } from "@/components/ModalsHost"

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  style: "normal",
})

const iranSansFont = localFont({
  src: [
    { path: "../public/fonts/IRANSansWeb_UltraLight.woff2", weight: "200", style: "normal" },
    { path: "../public/fonts/IRANSansWeb_Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/IRANSansWeb.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/IRANSansWeb_Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/IRANSansWeb_Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/IRANSansWeb_Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-iransans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Pika AI",
  description: "Pika AI Assistant",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png" },
    ],
    apple: "/apple-touch-icon",
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest"
      }
    ]
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl">
      <body
        className={` ${interFont.variable} ${iranSansFont.variable} antialiased`}
      >
        <Providers>
          {children}
          <ModalsHost />
          <Toaster
            dir="rtl"
            position="bottom-left"
            toastOptions={{
              className: "font-iransans"
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
