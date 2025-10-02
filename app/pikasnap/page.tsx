import { Metadata } from "next"
import PikaSnapForm from "@/components/pikasnap/PikaSnapForm"

export const generateMetadata = (): Metadata => ({
    title: "PikaSnap",
    description: "An AI image assistant for searching products"
})


const pikasnap = () => {

  return (
    <PikaSnapForm />
  )
}

export default pikasnap