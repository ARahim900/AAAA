"use client"

import { useState } from "react"
import { SideNavigation } from "./side-navigation"
import { Header } from "./header"
import { Breadcrumb } from "@/components/ui/breadcrumb"

interface MainLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showPeriodSelector?: boolean
  showControls?: boolean
  showTabs?: boolean
  showBreadcrumb?: boolean
  tabs?: { value: string; label: string }[]
  selectedTab?: string
  onTabChange?: (value: string) => void
  periodOptions?: { value: string; label: string }[]
  selectedPeriod?: string
  onPeriodChange?: (value: string) => void
}

export function MainLayout({
  children,
  title,
  subtitle,
  showPeriodSelector = true,
  showControls = true,
  showTabs = false,
  showBreadcrumb = true,
  tabs = [],
  selectedTab,
  onTabChange,
  periodOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ],
  selectedPeriod = "monthly",
  onPeriodChange = () => {},
}: MainLayoutProps) {
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavigation />
      
      <div className="flex-1 lg:ml-64">
        <Header
          title={title}
          subtitle={subtitle}
          showPeriodSelector={showPeriodSelector}
          showControls={showControls}
          showTabs={showTabs}
          tabs={tabs}
          selectedTab={selectedTab}
          onTabChange={onTabChange}
          periodOptions={periodOptions}
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
        />
        
        <main className="container mx-auto px-4 py-6 lg:px-8">
          {showBreadcrumb && (
            <div className="mb-6">
              <Breadcrumb className="text-sm text-gray-500" />
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  )
}
