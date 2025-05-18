"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbProps {
  className?: string
  homeIcon?: React.ReactNode
  separatorIcon?: React.ReactNode
}

export function Breadcrumb({
  className = "",
  homeIcon = <Home className="h-4 w-4" />,
  separatorIcon = <ChevronRight className="h-3 w-3 text-gray-400" />
}: BreadcrumbProps) {
  const pathname = usePathname()
  
  if (pathname === "/") {
    return null
  }
  
  // Split and decode the path segments
  const segments = pathname?.split("/").filter(Boolean).map(segment => decodeURIComponent(segment)) || []
  
  // Create the breadcrumbs
  const breadcrumbs = [
    { 
      name: "Home", 
      href: "/", 
      icon: homeIcon,
      active: false 
    },
    ...segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`
      return {
        name: formatSegment(segment),
        href,
        active: index === segments.length - 1
      }
    })
  ]
  
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-sm ${className}`}>
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && <span className="mx-1">{separatorIcon}</span>}
            
            {breadcrumb.active ? (
              <span className="font-medium text-gray-600" aria-current="page">
                {breadcrumb.name}
              </span>
            ) : (
              <Link 
                href={breadcrumb.href} 
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                {index === 0 && breadcrumb.icon}
                {index === 0 ? "" : breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Helper to format the segment for display
function formatSegment(segment: string): string {
  // Handle slug format with hyphens or underscores
  const formatted = segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize first letter of each word
  
  // Handle special cases
  const specialCases: Record<string, string> = {
    "stp-plant": "STP Plant",
    "stp": "STP Plant",
  }
  
  return specialCases[segment.toLowerCase()] || formatted
}
