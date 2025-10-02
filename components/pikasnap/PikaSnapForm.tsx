"use client"

import ProductTypes from "@/data/pikasnap-producttypes.json"
import ImageUploader from "./ImageUploader"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import DetailsContainer from "./DetailsContainer"
import { usePikaSnapStore } from "@/stores/usePikaSnapStore"

interface UploadPayload {
  product_name: string
  product_description: string
  pikatak_category_id: number
  images: {
    [key: string]: {
      image_id: number
      base_64_format: string
    }
  }
}


const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            if (typeof reader.result === "string") {
                const base64 = reader.result.split(",")[1]
                resolve(base64)
            } else {
                reject("Failed to convr file to base64")
            }
        }
        reader.onerror = (err) => reject(err)
    })
}

const uploadImage = async (payload: UploadPayload) => {
    const response = await fetch("/api/image-upload", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        throw new Error("Upload failed!")
    }

    return response.json()
}


const PikaSnapForm = () => {
    const [productName, setProductName] = useState<string>("")
    const [productDescription, setProductDescription] = useState<string>("")
    const [selectedType, setSelectedType] = useState<number>(0)
    const [images, setImages] = useState<File[]>([])

    const { specifications, setSpecifications } = usePikaSnapStore()
    

    const mutation = useMutation({
        mutationFn: uploadImage,
        onSuccess: (data) => {
            if (data?.specifications) {
                setSpecifications(data.specifications)
            }

            alert("با موفقیت ارسال شد. ✅")
            setImages([])
            setProductName("")
            setProductDescription("")
            setSelectedType(0)
        },
        onError: (err: unknown) => {
            console.error("Upload error ❌", err)
            alert("بارگذاری موفقیت آمیز نبود!")
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!productName.trim()) return

        if (!productName || !productDescription || selectedType === 0 || images.length === 0) {
            alert("لطفا همه‌ی فیلد‌ها را پر کنید.")
            return
        }

        const base64Images = await Promise.all(
            images.map(async (file, index) => {
                const base64 = await fileToBase64(file)
                return [`image${index + 1}`, { image_id: 1, base_64_format: base64 }] as const
            })
        )

        const imagesObj = Object.fromEntries(base64Images)

        const payload: UploadPayload = {
            product_name: productName.trim(),
            product_description: productDescription.trim(),
            pikatak_category_id: selectedType,
            images: imagesObj,
        }

        mutation.mutate(payload)
    }

  return (
    <section
        className="flex flex-col space-y-6 min-h-screen bg-gradient-to-b from-white to-blue-100"
    >
        <header
            className="p-4 my-6"
        >
            <h1
                className="text-4xl font-bold text-center text-blue-900"
            >
                پیکا اسنپ
            </h1>
        </header>
        
        <main
            className="w-full flex flex-col flex-1 items-center justify-center py-8 space-y-12"
        >

            <form
                className="flex flex-col space-y-8 max-w-4xl shadow-inner shadow-indigo-200 rounded-2xl p-6 bg-white/30 backdrop-blur-lg"
                onSubmit={handleSubmit}
            >
                <label
                    className="flex flex-col gap-2"
                    htmlFor="product-name"
                >
                    نام محصول:
                    <input 
                        className="bg-gray-100 border border-gray-200 rounded-xl p-2 cursor-pointer focus-visible:outline-indigo-400 hover:border-indigo-300 transition-colors"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </label>

                <label
                    className="flex flex-col gap-2"
                    htmlFor="product-type"
                >
                    نوع محصول:
                    <select 
                        className="bg-gray-100 border border-gray-200 rounded-xl p-2 cursor-pointer focus-visible:outline-indigo-400 hover:border-indigo-300 transition-colors" 
                        value={selectedType}
                        onChange={(e) => setSelectedType(Number(e.target.value))}
                    >
                        <option value={0} disabled>انتخاب نوع</option>
                        {ProductTypes["product-types"].map((type) => (
                            <option
                                key={type.id}
                                value={type.id}
                            >
                                {type.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label
                    className="flex flex-col gap-2"
                    htmlFor="product-brand"
                >
                    شرح محصول:
                    <textarea 
                        className="bg-gray-100 border border-gray-200 rounded-xl p-2 cursor-pointer focus-visible:outline-indigo-400 hover:border-indigo-300 transition-colors resize-none"
                        value={productDescription}
                        rows={5}
                        onChange={(e) => setProductDescription(e.target.value)}
                    >
                    </textarea>
                </label>

                <ImageUploader 
                    images={images}
                    setImages={setImages}
                />

                <button
                    className={`bg-indigo-600 text-white rounded-xl p-3 font-semibold hover:bg-indigo-700 transition ${mutation.isPending ? "cursor-not-allowed bg-gray-400" : ""}`}
                    type="submit"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "در حال ارسال..." : "ارسال"}
                </button>
            </form>
            
            {specifications.length !== 0 && (
                <DetailsContainer />
            )}
        </main>    
    </section>
  )
}

export default PikaSnapForm