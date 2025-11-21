import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface ProductProps {
  name: string
  price: string
  image: string
  tag: string
}

export function ProductRecommendation({ name, price, image, tag }: ProductProps) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-black/20 hover:bg-white/5 transition-colors group">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5 shrink-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">{tag}</span>
        </div>
        <h4 className="font-medium text-sm truncate text-gray-200 group-hover:text-white transition-colors">{name}</h4>
        <p className="text-sm font-bold text-white">{price}</p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}
