import { NextRequest, NextResponse } from "next/server"

// Sample STP plant data (in a real app, this would come from a database)
const stpData = [
  {
    "Date:": "2024-03-14",
    "Total Inlet Sewage Received from (MB+Tnk) -m³": 198,
    "Total Treated Water Produced - m³": 186,
    "Total TSE Water Output to Irrigation - m³": 178,
    "pH": 7.2,
    "COD (mg/L)": 35,
    "BOD (mg/L)": 12,
    "TSS (mg/L)": 18,
    "TDS (mg/L)": 840,
    "Chlorine (mg/L)": 0.8,
  },
  {
    "Date:": "2024-03-13",
    "Total Inlet Sewage Received from (MB+Tnk) -m³": 205,
    "Total Treated Water Produced - m³": 192,
    "Total TSE Water Output to Irrigation - m³": 185,
    "pH": 7.3,
    "COD (mg/L)": 37,
    "BOD (mg/L)": 14,
    "TSS (mg/L)": 17,
    "TDS (mg/L)": 830,
    "Chlorine (mg/L)": 0.7,
  },
  {
    "Date:": "2024-03-12",
    "Total Inlet Sewage Received from (MB+Tnk) -m³": 187,
    "Total Treated Water Produced - m³": 176,
    "Total TSE Water Output to Irrigation - m³": 168,
    "pH": 7.4,
    "COD (mg/L)": 32,
    "BOD (mg/L)": 11,
    "TSS (mg/L)": 15,
    "TDS (mg/L)": 850,
    "Chlorine (mg/L)": 0.9,
  },
  {
    "Date:": "2024-03-11",
    "Total Inlet Sewage Received from (MB+Tnk) -m³": 195,
    "Total Treated Water Produced - m³": 184,
    "Total TSE Water Output to Irrigation - m³": 175,
    "pH": 7.2,
    "COD (mg/L)": 38,
    "BOD (mg/L)": 15,
    "TSS (mg/L)": 20,
    "TDS (mg/L)": 820,
    "Chlorine (mg/L)": 0.8,
  },
  {
    "Date:": "2024-03-10",
    "Total Inlet Sewage Received from (MB+Tnk) -m³": 203,
    "Total Treated Water Produced - m³": 190,
    "Total TSE Water Output to Irrigation - m³": 182,
    "pH": 7.5,
    "COD (mg/L)": 34,
    "BOD (mg/L)": 13,
    "TSS (mg/L)": 16,
    "TDS (mg/L)": 835,
    "Chlorine (mg/L)": 0.7,
  },
  {
    "Date:": "2024-03-09",
    "Total Inlet Sewage Received from (MB+Tnk) -m³": 189,
    "Total Treated Water Produced - m³": 179,
    "Total TSE Water Output to Irrigation - m³": 170,
    "pH": 7.3,
    "COD (mg/L)": 36,
    "BOD (mg/L)": 12,
    "TSS (mg/L)": 19,
    "TDS (mg/L)": 845,
    "Chlorine (mg/L)": 0.8,
  },
  {
    "Date:": "2024-03-08",
    "Total Inlet Sewage Received from (MB+Tnk) -m³": 197,
    "Total Treated Water Produced - m³": 184,
    "Total TSE Water Output to Irrigation - m³": 176,
    "pH": 7.2,
    "COD (mg/L)": 33,
    "BOD (mg/L)": 11,
    "TSS (mg/L)": 15,
    "TDS (mg/L)": 825,
    "Chlorine (mg/L)": 0.9,
  },
]

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get("period") || "daily"
  const startDate = searchParams.get("startDate") || null
  const endDate = searchParams.get("endDate") || null

  // Filter data based on parameters
  let filteredData = stpData

  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    filteredData = filteredData.filter((item) => {
      const itemDate = new Date(item["Date:"])
      return itemDate >= start && itemDate <= end
    })
  }

  // Add artificial delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json(filteredData)
}
