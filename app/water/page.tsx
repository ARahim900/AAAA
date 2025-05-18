"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
// Import both components for flexibility
import WaterDashboard from "@/components/water-dashboard"
import NewWaterDashboardHeader from "@/components/new-water-dashboard-header"

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

  // You can choose which component to render based on your preference
  // Option 1: Use the updated WaterDashboard component that already has the new header design
  // Option 2: Use the completely new header component 

  return (
    <>
      {/* Option 1: Use the original dashboard with the changes already made */}
      <WaterDashboard />
      
      {/* Option 2: Or use just the new header component */}
      {/* <NewWaterDashboardHeader /> */}
    </>
  )
}