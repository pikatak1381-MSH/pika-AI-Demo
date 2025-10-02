"use client"

import { motion } from "framer-motion"
import { FileCog, Handshake, PackageSearch, Globe } from "lucide-react"

const shortcutBtns = [
    { text: "پیش فاکتور", icon: FileCog, iconColor: "#1ADEA4" },
    { text: "دستیار خرید", icon: Handshake, iconColor: "#1976D0" },
    { text: "دستیار فنی", icon: PackageSearch, iconColor: "#FF9500" },
    { text: "قیمت جهانی ", icon: Globe, iconColor: "#AA50D8" },
]


const ShortCutButtons = () => {
  return (
    <div
        className="flex space-x-5.5 mt-8"
    >
        {shortcutBtns.map((btn, index) => {
            const Icon = btn.icon
            return (
                <motion.button
                    className="flex items-center rounded-3xl text-sm md:text-base text-[#1E1E1E] border border-[#BABABA] py-1.5 px-2 gap-2 shadow-[0px_35px_64px_0px_#00000014] hover:bg-[#E0E0E0]/80 transition-colors duration-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 * index }}
                    key={btn.text}
                >
                    <Icon size={22} style={{ color: btn.iconColor }} />
                    {btn.text}
                </motion.button>
            )
        })}
    </div>
  )
}

export default ShortCutButtons