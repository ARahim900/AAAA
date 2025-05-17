import { NextRequest, NextResponse } from "next/server"

// Sample electricity data (in a real app, this would come from a database)
const electricityData = [
  {
    building: "Main Building",
    category: "Commercial",
    meterID: "EM001",
    "Oct-2023": 45780,
    "Nov-2023": 43250,
    "Dec-2023": 48900,
    "Jan-2024": 52300,
    "Feb-2024": 49600,
    "Mar-2024": 51200,
  },
  {
    building: "Residential Block A",
    category: "Residential",
    meterID: "EM002",
    "Oct-2023": 32450,
    "Nov-2023": 30800,
    "Dec-2023": 33500,
    "Jan-2024": 37200,
    "Feb-2024": 35400,
    "Mar-2024": 36700,
  },
  {
    building: "Residential Block B",
    category: "Residential",
    meterID: "EM003",
    "Oct-2023": 29800,
    "Nov-2023": 28350,
    "Dec-2023": 30900,
    "Jan-2024": 34500,
    "Feb-2024": 32750,
    "Mar-2024": 33900,
  },
  {
    building: "Community Center",
    category: "Common Areas",
    meterID: "EM004",
    "Oct-2023": 12300,
    "Nov-2023": 11700,
    "Dec-2023": 13600,
    "Jan-2024": 15200,
    "Feb-2024": 14350,
    "Mar-2024": 14750,
  },
  {
    building: "Sports Complex",
    category: "Common Areas",
    meterID: "EM005",
    "Oct-2023": 4670,
    "Nov-2023": 3900,
    "Dec-2023": 5100,
    "Jan-2024": 5800,
    "Feb-2024": 5900,
    "Mar-2024": 5450,
  },
]

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get("period") || "monthly"
  const category = searchParams.get("category") || null
  const building = searchParams.get("building") || null

  // Filter data based on parameters
  let filteredData = electricityData

  if (category) {
    filteredData = filteredData.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    )
  }

  if (building) {
    filteredData = filteredData.filter(
      (item) => item.building.toLowerCase().includes(building.toLowerCase())
    )
  }

  // Add artificial delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json(filteredData)
}
