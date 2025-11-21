import { cn } from "@/lib/utils"

interface MinistryBadgeProps {
  name: string
  className?: string
  color?: string
}

export function MinistryBadge({ name, className, color = "bg-blue-500" }: MinistryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white",
        color,
        className,
      )}
    >
      {name}
    </span>
  )
}
