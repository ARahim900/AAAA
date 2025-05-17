import { NextRequest, NextResponse } from "next/server"

// Sample water data (in a real app, this would come from a database)
const waterData = [
  {
    month: "Oct-2023",
    L1: 31519,
    L2: 29913,
    L3: 27765,
    Stage01Loss: 1606,
    Stage02Loss: 2148,
    TotalLoss: 3754,
  },
  {
    month: "Nov-2023",
    L1: 35290,
    L2: 32492,
    L3: 30881,
    Stage01Loss: 2798,
    Stage02Loss: 1611,
    TotalLoss: 4409,
  },
  {
    month: "Dec-2023",
    L1: 36733,
    L2: 35325,
    L3: 33259,
    Stage01Loss: 1408,
    Stage02Loss: 2066,
    TotalLoss: 3474,
  },
  {
    month: "Jan-2024",
    L1: 32580,
    L2: 31325,
    L3: 28545,
    Stage01Loss: 1255,
    Stage02Loss: 2780,
    TotalLoss: 4035,
  },
  {
    month: "Feb-2024",
    L1: 34043,
    L2: 31811,
    L3: 29369,
    Stage01Loss: 2232,
    Stage02Loss: 2442,
    TotalLoss: 4674,
  },
  {
    month: "Mar-2024",
    L1: 35915,
    L2: 34565,
    L3: 32064,
    Stage01Loss: 1350,
    Stage02Loss: 2501,
    TotalLoss: 3851,
  },
]

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get("period") || "monthly"

  // Filter or transform data based on period (in a real app)
  let filteredData = waterData

  // Add artificial delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json(filteredData)
}
