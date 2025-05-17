import { NextRequest, NextResponse } from "next/server"

// Sample contractors data (in a real app, this would come from a database)
const contractorsData = [
  {
    ID: "CON-2023-001",
    Contractor: "ABC Maintenance Services LLC",
    ServiceProvided: "HVAC Maintenance",
    Status: "Active",
    ContractType: "Annual",
    ContractValue: 75000,
    StartDate: "2023-06-15",
    EndDate: "2024-06-14",
    ContactPerson: "Ahmed Al Balushi",
    ContactEmail: "ahmed@abcmaintenance.com",
    ContactPhone: "+968 9123 4567",
  },
  {
    ID: "CON-2023-002",
    Contractor: "Green Landscape Solutions",
    ServiceProvided: "Landscaping & Irrigation",
    Status: "Active",
    ContractType: "Annual",
    ContractValue: 128000,
    StartDate: "2023-04-01",
    EndDate: "2024-03-31",
    ContactPerson: "Fatima Al Zadjali",
    ContactEmail: "fatima@greenlandscape.com",
    ContactPhone: "+968 9876 5432",
  },
  {
    ID: "CON-2023-003",
    Contractor: "Secure Systems International",
    ServiceProvided: "Security Services",
    Status: "Active",
    ContractType: "Biennial",
    ContractValue: 235000,
    StartDate: "2023-01-01",
    EndDate: "2024-12-31",
    ContactPerson: "Khalid Al Rawahi",
    ContactEmail: "khalid@securesystems.com",
    ContactPhone: "+968 9567 8901",
  },
  {
    ID: "CON-2022-008",
    Contractor: "Aqua Solutions LLC",
    ServiceProvided: "Water Treatment",
    Status: "Expiring Soon",
    ContractType: "Annual",
    ContractValue: 85000,
    StartDate: "2023-04-15",
    EndDate: "2024-04-14",
    ContactPerson: "Laila Al Habsi",
    ContactEmail: "laila@aquasolutions.com",
    ContactPhone: "+968 9234 5678",
  },
  {
    ID: "CON-2023-010",
    Contractor: "Elite Cleaning Services",
    ServiceProvided: "Cleaning Services",
    Status: "Active",
    ContractType: "Annual",
    ContractValue: 96000,
    StartDate: "2023-09-01",
    EndDate: "2024-08-31",
    ContactPerson: "Saif Al Busaidi",
    ContactEmail: "saif@elitecleaning.com",
    ContactPhone: "+968 9345 6789",
  },
  {
    ID: "CON-2022-012",
    Contractor: "TechPro Solutions",
    ServiceProvided: "IT Systems Maintenance",
    Status: "Expiring Soon",
    ContractType: "Annual",
    ContractValue: 110000,
    StartDate: "2023-05-01",
    EndDate: "2024-04-30",
    ContactPerson: "Nadia Al Kindi",
    ContactEmail: "nadia@techpro.com",
    ContactPhone: "+968 9456 7890",
  },
  {
    ID: "CON-2023-015",
    Contractor: "Power Solutions LLC",
    ServiceProvided: "Generator Maintenance",
    Status: "Active",
    ContractType: "Biennial",
    ContractValue: 135000,
    StartDate: "2023-08-15",
    EndDate: "2025-08-14",
    ContactPerson: "Omar Al Farsi",
    ContactEmail: "omar@powersolutions.com",
    ContactPhone: "+968 9567 8902",
  },
]

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status") || null
  const service = searchParams.get("service") || null
  const contractType = searchParams.get("contractType") || null

  // Filter data based on parameters
  let filteredData = contractorsData

  if (status) {
    filteredData = filteredData.filter(
      (item) => item.Status.toLowerCase() === status.toLowerCase()
    )
  }

  if (service) {
    filteredData = filteredData.filter((item) =>
      item.ServiceProvided.toLowerCase().includes(service.toLowerCase())
    )
  }

  if (contractType) {
    filteredData = filteredData.filter(
      (item) => item.ContractType.toLowerCase() === contractType.toLowerCase()
    )
  }

  // Add artificial delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json(filteredData)
}
