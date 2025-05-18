"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { MainLayout } from "@/components/layout/main-layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Dynamically import dashboard components for better performance
const MainDashboard = dynamic(() => import("@/components/dashboard/main-dashboard"), {
  loading: () => (
    <div className="flex justify-center items-center h-96">
      <LoadingSpinner size="lg" />
    </div>
  ),
})

export default function Home() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  
  return (
    <MainLayout
      title="Muscat Bay Dashboard"
      subtitle="Utility Management System Overview"
      selectedPeriod={selectedPeriod}
      onPeriodChange={setSelectedPeriod}
      showTabs={false}
    >
      <MainDashboard selectedPeriod={selectedPeriod} />
    </MainLayout>
  )
}
