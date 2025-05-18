"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import WaterDashboard from "@/features/water/components/water-dashboard"

export default function WaterPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedTab, setSelectedTab] = useState("dashboard")
  
  const tabs = [
    { value: "dashboard", label: "Dashboard Overview" },
    { value: "zone", label: "Zone Analysis" },
    { value: "loss", label: "Loss Analysis" },
    { value: "trend", label: "Trend Analysis" },
    { value: "direct", label: "Direct Connection" },
    { value: "reports", label: "Reports & Insights" },
  ]

  return (
    <MainLayout
      title="Water Analytics"
      subtitle="Advanced Real-time Analytics Dashboard" 
      showPeriodSelector
      showTabs
      tabs={tabs}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      selectedPeriod={selectedPeriod}
      onPeriodChange={setSelectedPeriod}
    >
      <WaterDashboard tab={selectedTab} period={selectedPeriod} />
    </MainLayout>
  )
}
