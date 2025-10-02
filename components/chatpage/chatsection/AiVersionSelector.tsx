import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { useAiVersionStore, pikaAiVersions } from "@/stores/useAiVersionStore"


const AiVersionSelector = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const { selectedVersion, setVersion } = useAiVersionStore()

    const aiVersionModalRef = useRef<HTMLDivElement>(null)
    
    const toggleModal = () => {
        setIsModalOpen(prev => !prev)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                aiVersionModalRef.current &&
                !aiVersionModalRef.current.contains(event.target as Node)
            ) {
                setIsModalOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

  return (
    <div
        className="relative font-sans flex flex-col items-center justify-center rounded-lg cursor-pointer z-50 p-2"
        ref={aiVersionModalRef}
    >
        <button
            className="flex items-center text-black font-medium hover:bg-[#00000012] rounded-lg transition-colors text-lg gap-2 px-2 py-1"
            onClick={toggleModal}
        >
                {selectedVersion}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon-sm text-token-text-tertiary"><path d="M12.1338 5.94433C12.3919 5.77382 12.7434 5.80202 12.9707 6.02929C13.1979 6.25656 13.2261 6.60807 13.0556 6.8662L12.9707 6.9707L8.47067 11.4707C8.21097 11.7304 7.78896 11.7304 7.52926 11.4707L3.02926 6.9707L2.9443 6.8662C2.77379 6.60807 2.80199 6.25656 3.02926 6.02929C3.25653 5.80202 3.60804 5.77382 3.86617 5.94433L3.97067 6.02929L7.99996 10.0586L12.0293 6.02929L12.1338 5.94433Z"></path></svg>
        </button>

        {isModalOpen && (
            <AnimatePresence>
                <motion.div
                    className="bg-white absolute top-full left-0 w-full flex flex-col gap-1 px-2 py-1 border border-gray-200 rounded-xl shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {pikaAiVersions.map((version, index) => (
                        <motion.button
                            className={`flex items-center w-full text-base rounded-lg gap-1 p-1 hover:bg-[#00000012] transition-all ${selectedVersion === version ? "bg-gray-300 hover:bg-gray-300" : ""}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: 0.1 * index }}
                            key={version}
                            onClick={() => {
                                setVersion(version)
                                setIsModalOpen(false)
                            }}
                        >
                            <Image 
                                src="/icons/ai-white-icon.svg"
                                alt=""
                                width={22}
                                height={22}
                            />
                            {version}
                        </motion.button>
                    ))}
                </motion.div>
            </AnimatePresence>
        )}
    </div>
  )
}

export default AiVersionSelector