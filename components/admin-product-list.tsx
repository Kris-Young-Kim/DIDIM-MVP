"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, ExternalLink } from "lucide-react"
import Image from "next/image"

// Mock Data simulating n8n scraped data
const initialProducts = [
  {
    id: 1,
    name: "스마트 점자 디스플레이 BrailleOne",
    price: "3,500,000원",
    source: "Amazon US",
    category: "Visual",
    image: "/public/braille.jpg", // Updated image path
  },
  {
    id: 2,
    name: "경량 탄소섬유 휠체어 CarbonX",
    price: "2,800,000원",
    source: "AliExpress",
    category: "Mobility",
    image: "/public/classic-wooden-wheelchair.png", // Updated image path
  },
  {
    id: 3,
    name: "AI 음성 증폭 보청기 HearClear",
    price: "1,200,000원",
    source: "Medical Expo",
    category: "Hearing",
    image: "/public/hearing-aid.jpg", // Updated image path
  },
]

export function AdminProductList() {
  const [products, setProducts] = useState(initialProducts)

  const handleApprove = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
    // In real app: API call to update status to 'active'
  }

  const handleReject = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
    // In real app: API call to delete or mark 'rejected'
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>모든 제품이 처리되었습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors"
        >
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5 shrink-0">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                {product.category}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                from {product.source} <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            <h4 className="font-medium text-sm text-white truncate">{product.name}</h4>
            <p className="text-sm font-bold text-gray-400">{product.price}</p>
          </div>

          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={() => handleReject(product.id)}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-500/10"
              onClick={() => handleApprove(product.id)}
            >
              <Check className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
