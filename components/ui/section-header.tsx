import React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
  actions?: React.ReactNode
}

export function SectionHeader({ title, description, className, actions }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6", className)}>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      {actions && <div className="mt-3 sm:mt-0 flex-shrink-0">{actions}</div>}
    </div>
  )
}
