
import { usePikaSnapStore } from "@/stores/usePikaSnapStore"

const DetailsContainer = () => {
    const { specifications } = usePikaSnapStore()

  return (
    <section
        className="flex flex-col space-y-8 max-w-6xl shadow-inner shadow-indigo-200 rounded-2xl p-6 bg-white/30 backdrop-blur-lg"
    >
        <ul>
            {specifications.map((spec, index) => (
                <li
                    key={index}
                    className="flex justify-between border-b py-2 last:border-b-0"
                >
                    <span className="font-semibold">{spec.attribute}:</span>
                    <span >{spec.value}</span>
                </li>
            ))}
        </ul>
    </section>
  )
}

export default DetailsContainer