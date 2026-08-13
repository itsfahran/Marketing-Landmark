import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
        secondary: "border-gray-300 bg-gray-100 text-gray-900 hover:bg-gray-200",
        destructive: "border-red-600 bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 text-gray-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
