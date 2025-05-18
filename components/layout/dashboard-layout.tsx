"use client"

import type React from "react"
import { MainNavigation } from "./main-navigation"
import { Footer } from "./footer"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
  onBack?: () => void
}

export function DashboardLayout({ children, title, subtitle, showBackButton = false, onBack }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavigation />

      {/* Header - Simplified and consistent design */}
      <div 
        className="bg-gradient-to-br from-[#4E4456] to-[#694E5F] pt-16 pb-6 px-6 relative overflow-hidden"
        style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={onBack}
                className="mr-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                aria-label="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Muscat Bay Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                {subtitle && <p className="text-purple-100 mt-1">{subtitle}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">{children}</main>

      <Footer />
    </div>
  )
}
