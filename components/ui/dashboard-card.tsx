"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  mainValueLabel?: string
  mainValue?: number | string
  mainValueUnit?: string
  statusText?: string
  statusColorClass?: string
  trendValue?: number
  trendLabel?: string
  children?: React.ReactNode
}

export function DashboardCard({
  icon,
  title,
  description,
  mainValueLabel,
  mainValue,
  mainValueUnit = "",
  statusText,
  statusColorClass = "text-gray-500",
  trendValue,
  trendLabel,
  children,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <Card className={cn("overflow-hidden border-l-4 border-l-[#8ACCD5]", className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mainValueLabel && (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{mainValueLabel}</p>
                <p className="text-2xl font-bold text-[#4E4456]">
                  {typeof mainValue === "number" ? mainValue.toLocaleString() : mainValue}
                  {mainValueUnit && <span className="text-lg ml-1">{mainValueUnit}</span>}
                </p>
              </div>
              
              {/* Trend indicator if available */}
              {typeof trendValue === "number" && (
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-xs font-medium",
                  trendValue > 0 
                    ? "bg-green-100 text-green-600" 
                    : trendValue < 0 
                      ? "bg-red-100 text-red-600" 
                      : "bg-gray-100 text-gray-600"
                )}>
                  {trendValue > 0 ? "+" : ""}{trendValue.toFixed(1)}%
                </div>
              )}
            </div>
          )}
          
          {/* Status text if available */}
          {statusText && (
            <p className={cn("text-xs", statusColorClass)}>
              {statusText}
            </p>
          )}
          
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
