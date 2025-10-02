"use client"

import { ChangeEvent, Dispatch, SetStateAction } from "react"
import Image from "next/image"

interface ImageUploaderProps {
    images: File[]
    setImages: Dispatch<SetStateAction<File[]>>
}


const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const filesArray = Array.from(e.target.files)

        setImages((prev) => [...prev, ...filesArray])

        e.target.value = ""
    }

  return (
    <div
        className="w-full max-w-sm p-4 mx-auto bg-white rounded-2xl shadow-md flex flex-col items-center space-y-4"
    >
        <label
            className="w-full flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition"
            htmlFor="file-upload"
        >
            <span className="text-gray-600 text-sm">بارگذاری عکس</span>
            <input 
                className="hidden"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                id="file-upload"
                name="file-upload"
            />
        </label>
        <div
            className="flex gap-4 flex-wrap"
        >
            {images.map((file, index) => {
                const previewUrl = URL.createObjectURL(file)
                return (
                    <Image
                        className="w-24 h-24 object-cover rounded-xl border"
                        src={previewUrl}
                        key={index}
                        alt={`preview ${index}`}
                        width={96}
                        height={96}
                    />
                )
            })}
        </div>
    </div>
  )
}

export default ImageUploader