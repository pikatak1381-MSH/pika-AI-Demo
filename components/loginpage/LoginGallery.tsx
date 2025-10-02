"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import AnimatedContainer from "../ui/AnimatedContainer"
import { useState, /* useEffect, useRef  */} from "react"


const LoginGallery = () => {
    const [isExpensive, /* setIsExpensive */] = useState<boolean>(false)
    /* const [audioPlaying, setAuidoPlaying] = useState<boolean>(false) */

    /* Tests */
    /* const keysPressed = useRef<Set<string>>(new Set()) */
    /* const audioRef = useRef<HTMLAudioElement>(null) */
    
    /* useEffect(() => {
        const audio = audioRef.current

        if (!audio) return

        if (audioPlaying) {
            audio.play()
        } else {
            audio.pause()
            audio.currentTime = 0
        }

    }, [audioPlaying]) */

    
    /* useEffect(() => {
        const activeExpensiveness = (e: KeyboardEvent) => {
        
        if (!e.key) return
            keysPressed.current.add(e.key.toLowerCase())

        if (
            keysPressed.current.has("control") &&
            keysPressed.current.has("q") &&
            keysPressed.current.has("a")
        ) {
            e.preventDefault()
            setIsExpensive(prev => !prev)
            setAuidoPlaying(prev => !prev)
        }
        }

        const deactiveExpensiveness = (e: KeyboardEvent) => {
        if (!e.key) return
        keysPressed.current.delete(e.key.toLowerCase())
        }

        window.addEventListener("keydown", activeExpensiveness)
        window.addEventListener("keyup", deactiveExpensiveness)

        return () => {
        window.removeEventListener("keydown", activeExpensiveness);
        window.removeEventListener("keyup", deactiveExpensiveness);
        }
    }, []) */

  return (
    <div
        className="hidden md:flex items-center justify-center flex-1 px-8 overflow-hidden"
    >
        <div
            className={`relative flex w-full max-w-[730px] aspect-square max-h-[80vh] ${isExpensive ? "flicker" : ""}`}
        >
            <AnimatedContainer
                variant="fade"
            >
                {/* Small Polygon */}
                <motion.div
                    className="hidden xl:block absolute bottom-4 right-4 sm:bottom-6 sm:right-8 md:bottom-8 md:right-12"
                    key="polygon-small"
                    animate={{
                        y: isExpensive ? [0, -50, 0] : [0, -10, 0],
                        x: isExpensive ? [0, 90, 0] : [0, 0, 0],
                    }}
                    transition={{
                        duration: isExpensive ? 0.5 : 3,       
                        repeat: Infinity,  
                        ease: "easeInOut", 
                    }}                    
                >
                    <Image
                        className="w-12 sm:w-16 md:w-20 lg:w-[109px]"
                        src="/polygon-small.svg"
                        alt="Small Robot Image"
                        width={109}
                        height={109}
                        priority
                    />
                </motion.div>

                {/* Medium Polygon*/}
                <motion.div
                    className="hidden xl:block absolute top-4 right-4 sm:top-6 sm:right-8 md:top-0 md:right-0"
                    key="polygon-medium"
                    animate={{
                        y: isExpensive ? [0, -40, 0] : [0, 10, 0],
                        x: isExpensive ? [0, 150, 0] : [0, 0, 0],
                    }}
                    transition={{
                        duration: isExpensive ? 0.5 : 4,       
                        repeat: Infinity,  
                        ease: "easeInOut", 
                    }} 
                >
                    <Image
                        className="w-1/3 sm:w-1/4 md:w-1/3 lg:w-full max-w-[240px] hex-shadow-medium"
                        src="/polygon-medium.svg"
                        alt="Medium Robot Image"
                        width={240}
                        height={240}
                        priority
                    />
                </motion.div>

                {/* Large Polygon */}
                <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                    key="polygon-large"
                    animate={{
                        y: isExpensive ? [0, -40, 0] :[0, -8, 0],
                        x: isExpensive ? [0, 70, 0] : [0, 0, 0],
                    }}
                    transition={{
                        duration: isExpensive ? 0.5 : 6,       
                        repeat: Infinity,  
                        ease: "easeInOut", 
                    }} 
                >
                    <Image
                        className="w-40 sm:w-56 md:w-72 lg:w-[470px] hex-shadow-large"
                        src="/polygon-large.svg"
                        alt="Large Robot image"
                        width={470}
                        height={470}
                        priority
                    />
                </motion.div>
            </AnimatedContainer>
            {/* <audio 
                ref={audioRef}
                src="test/test-audio.mp3"
                loop
                onEnded={() => setAuidoPlaying(false)}
            /> */}
        </div>
    </div>
  )
}

export default LoginGallery