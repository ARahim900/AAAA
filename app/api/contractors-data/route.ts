import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    // Mock contractors data since we don't have a real data source yet
    const mockContractorsData = [
      {
        Contractor: "ABC Maintenance",
        ServiceProvided: "HVAC Maintenance",
        Status: "Active",
        ContractType: "Annual",
        StartDate: "2023-01-15",
        EndDate: "2024-01-14"
      },
      {
        Contractor: "XYZ Security",
        ServiceProvided: "Security Services",
        Status: "Active",
        ContractType: "Long-term",
        StartDate: "2022-06-01",
        EndDate: "2025-05-31"
      },
      {
        Contractor: "Green Landscaping",
        ServiceProvided: "Landscaping",
        Status: "Active",
        ContractType: "Annual",
        StartDate: "2023-03-01",
        EndDate: "2024-02-29"
      },
      {
        Contractor: "Tech Solutions",
        ServiceProvided: "IT Support",
        Status: "Expiring Soon",
        ContractType: "Annual",
        StartDate: "2023-04-01",
        EndDate: "2024-03-31"
      },
      {
        Contractor: "Plumbing Experts",
        ServiceProvided: "Plumbing Services",
        Status: "Active",
        ContractType: "Annual",
        StartDate: "2023-02-15",
        EndDate: "2024-02-14"
      },
      {
        Contractor: "Electrical Systems Inc",
        ServiceProvided: "Electrical Maintenance",
        Status: "Expiring Soon",
        ContractType: "Annual",
        StartDate: "2023-05-01",
        EndDate: "2024-04-30"
      },
      {
        Contractor: "Clean & Clear",
        ServiceProvided: "Cleaning Services",
        Status: "Active",
        ContractType: "Monthly",
        StartDate: "2023-01-01",
        EndDate: null
      }
    ];

    return NextResponse.json(mockContractorsData);
  } catch (error) {
    console.error("Error providing contractors data:", error);
    return NextResponse.json({ message: "Error fetching data", error: (error as Error).message }, { status: 500 });
  }
}