import { NextRequest, NextResponse } from 'next/server';

// Mock data for waste management
const wasteManagementData = [
  {
    date: '2025-01-01',
    generalWaste: 1250,
    recyclableWaste: 450,
    organicWaste: 320,
    hazardousWaste: 80,
    totalCollected: 2100,
    recyclingRate: 21.4
  },
  {
    date: '2025-02-01',
    generalWaste: 1180,
    recyclableWaste: 520,
    organicWaste: 350,
    hazardousWaste: 70,
    totalCollected: 2120,
    recyclingRate: 24.5
  },
  {
    date: '2025-03-01',
    generalWaste: 1130,
    recyclableWaste: 580,
    organicWaste: 390,
    hazardousWaste: 60,
    totalCollected: 2160,
    recyclingRate: 26.9
  },
  {
    date: '2025-04-01',
    generalWaste: 1050,
    recyclableWaste: 610,
    organicWaste: 420,
    hazardousWaste: 55,
    totalCollected: 2135,
    recyclingRate: 28.6
  },
  {
    date: '2025-05-01',
    generalWaste: 980,
    recyclableWaste: 650,
    organicWaste: 460,
    hazardousWaste: 50,
    totalCollected: 2140,
    recyclingRate: 30.4
  }
];

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(wasteManagementData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch waste management data' },
      { status: 500 }
    );
  }
}
