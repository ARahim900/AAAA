"use client"

import { useState, useEffect } from "react"
import { SideNavigation } from "./side-navigation"

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check localStorage for sidebar state
    const savedState = localStorage.getItem('sideNavCollapsed')
    setIsCollapsed(savedState === 'true')

    // Add event listener to detect changes to localStorage
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem('sideNavCollapsed')
        setIsCollapsed(savedState === 'true')
      }
    }

    // Check for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("resize", checkMobile)

    // Custom event for sidebar toggle
    window.addEventListener("sidebarToggle", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("sidebarToggle", handleStorageChange)
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavigation />
      <div 
        className={`flex-1 transition-all duration-300 ${isMobile ? "ml-0" : (isCollapsed ? "ml-20" : "ml-64")}`}
      >
        {children}
      </div>
    </div>
  )
}