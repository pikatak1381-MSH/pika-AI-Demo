"use client"

import React, { useState } from "react"
import { useInvoiceStore } from "@/stores/useInvoiceStore"
import { ChatbotResponse } from "@/lib/types"
import OfferDetails from "./OfferDetails"
import Checkbox from "@/components/ui/Checkbox"
import ProductGalleryModal from "@/components/chatpage/ProductGalleryModal"
import FarsiThousandSeperator from "@/components/ui/FarsiThousandSeperator"
import Image from "next/image"
import { ChevronDown, ChevronUp, Link } from "lucide-react"
import { Tooltip } from "@/components/ui/Tooltip"

interface OfferItemProps {
  offer: ChatbotResponse["offered_product_answer"][number]["offers"][number]
  expanded: boolean
  onToggle: () => void
}

const OfferItem: React.FC<OfferItemProps> = ({ offer, onToggle, expanded }) => {
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false)

  const { selectedProducts, addProduct, removeProduct } = useInvoiceStore()

  console.log(offer)
  return (
    <div
      className="flex flex-col space-y-2"
    >
      <div
        className="grid grid-cols-[1fr_auto] items-center gap-3 w-full px-2 py-1 rounded-2xl border border-transparent hover:border-gray-200 transition-all"
        key={offer.id}
      >
        <div
          className="flex items-center justify-start space-x-4"
        >
          <Checkbox 
            label={offer.name}
            checked={selectedProducts.some((product) => product.id === offer.id)}
            onChange={(e) => {
              if (e.target.checked) {
                addProduct(offer)
              } else {
                removeProduct(offer.id)
              }
            }}
          >
            {/* Carousel button */}
            <button
                className="rounded-2xl overflow-hidden border hover:border-blue-400 transition-colors"
                onClick={() => setGalleryOpen(true)}
            >
              <Image
                className="w-10 h-10 object-cover"
                src={offer.pictures?.[0] ?? "/icons/img-placeholder-light.svg"}
                alt={`${offer.name} image`}
                width={40}
                height={40}
              />
            </button>
          </Checkbox>

          <div
            className="w-full max-w-40 flex justify-between"
          >
            {/* Price Tag */}
            <span
              className="flex items-center gap-1 rounded-lg text-sm font-medium"
            >
              <FarsiThousandSeperator
                value={offer.original_price}
              />
              تومان
            </span>

            {/* Product Link */}
            <a
              className="cursor-pointer p-0.75 border border-[#D7D7D7] bg-white hover:bg-black hover:text-white rounded-2xl overflow-hidden flex items-center justify-center transition-colors"
              target="_blank"
              href={offer.url}
            >
              <Tooltip 
                content={
                  offer.url
                    ? new URL(offer.url).hostname.replace(/^www\./, "")
                    : "لینک نامشخص"
                }
              >
                <Link size={12} />
              </Tooltip>
            </a>
          </div>
        </div>

        {/* More details button */}
        <button
          className={`flex gap-2 items-center text-xs px-2 py-2 rounded-lg ${
            expanded
              ? "bg-red-100 text-black hover:bg-red-200"
              : "text-gray-600 hover:bg-gray-200"
          } transition-colors`}
            onClick={onToggle}
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          {expanded ? "بستن جزئیات" : "نمایش جزئیات"}
        </button>     
      </div>

      <OfferDetails 
        detailsOpen={expanded}
        specifications={offer.specifications}
      />

      <ProductGalleryModal 
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          images={offer.pictures || []}
      />
    </div>
  )
}

export default OfferItem