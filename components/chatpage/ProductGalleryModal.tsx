"use client"

import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProductGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
}


const ProductGalleryModal: React.FC<ProductGalleryModalProps> = ({ images, isOpen, onClose }) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [emblaRef, embla] = useEmblaCarousel({ loop: true })

  const handleImageError = (src: string) => {
    setFailedImages((prev) => new Set(prev).add(src))
  }

  const safeImages = images.filter((img) => !failedImages.has(img))

  const scrollPrev = () => embla?.scrollPrev()
  const scrollNext = () => embla?.scrollNext()

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
        {isOpen && (
          <DialogContent
            className="p-2 max-w-3xl w-full bg-white rounded-xl overflow-hidden"
          >
            <DialogTitle
              className="hidden"
            >
              گالری محصول
            </DialogTitle>

              {/* If no valid images exist */}
              {safeImages.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-gray-500"
                >
                  <Image 
                    src="/icons/img-placeholder-light.svg"
                    alt="No Images"
                    width={80}
                    height={80}
                  />
                  <p className="mt-4 text-sm">تصویری برای نمایش وجود ندارد</p>
                </div>
              ) : (
                /* Embla Carousel */
                <div
                  className="overflow-hidden [direction:ltr]"
                  ref={emblaRef}
                >
                  <div
                    className="flex"
                  >
                    {safeImages.map((img, index) =>(
                      <div
                        className="flex-[0_0_100%] flex items-center justify-center"
                        key={index}
                      >
                        <Image 
                          className="w-full h-auto object-contain rounded-md"
                          src={img}
                          alt={`Product image ${index + 1}`}
                          width={400}
                          height={400}
                          priority={index === 0}
                          loading={index === 0 ? "eager" : "lazy"}
                          onError={() => handleImageError(img)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-4">
                <button onClick={scrollPrev} 
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <ChevronRight />
                </button>
                <button onClick={scrollNext} 
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <ChevronLeft />
                </button>
              </div>
          </DialogContent>
        )}
    </Dialog>
  )
}

export default ProductGalleryModal