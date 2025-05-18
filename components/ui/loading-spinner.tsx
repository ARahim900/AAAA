import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "secondary" | "white"
  className?: string
}

export function LoadingSpinner({ 
  size = "md", 
  color = "primary",
  className
}: LoadingSpinnerProps) {
  return (
    <div className={cn(
      "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
      {
        "h-4 w-4": size === "sm",
        "h-8 w-8": size === "md",
        "h-12 w-12": size === "lg",
        "text-[#4E4456]": color === "primary",
        "text-[#8ACCD5]": color === "secondary",
        "text-white": color === "white"
      },
      className
    )} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  )
}
