"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  accentColor?: string
  loading?: boolean
  children: React.ReactNode
}

export function DashboardCard({
  title,
  description,
  icon,
  accentColor = "#4E4456",
  loading = false,
  children,
  className,
  ...props
}: DashboardCardProps) {
  const isMobile = useMobile()

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md",
        accentColor && `border-l-4 border-l-[${accentColor}]`,
        className
      )}
      {...props}
    >
      <CardHeader className="pb-2">
        {icon ? (
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">{icon}</span>
            {title}
          </CardTitle>
        ) : (
          <CardTitle className="text-lg">{title}</CardTitle>
        )}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#4E4456]"></div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
