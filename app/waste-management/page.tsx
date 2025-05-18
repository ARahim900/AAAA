"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import WasteManagementDashboard from "@/app/waste-management/page-content"

export default function WasteManagementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  
  return (
    <MainLayout
      title="Waste Management"
      subtitle="Waste collection and recycling analytics"
      selectedPeriod={selectedPeriod}
      onPeriodChange={setSelectedPeriod}
    >
      <WasteManagementDashboard period={selectedPeriod} />
    </MainLayout>
  )
}
