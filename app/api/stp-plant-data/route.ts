import { NextRequest, NextResponse } from 'next/server';

// Sample STP plant data
const stpPlantData = [
  {
    "Date:": "2025-04-16",
    "Total Inlet Sewage Received from (MB+Tnk) -m³": 1250,
    "Total Treated Water Produced - m³": 1175,
    "Total TSE Water Output to Irrigation - m³": 1050,
    "Power Consumption - kWh": 850,
    "BOD Inlet - mg/l": 280,
    "BOD Outlet - mg/l": 8,
    "COD Inlet - mg/l": 560,
    "COD Outlet - mg/l": 28,
    "TSS Inlet - mg/l": 320,
    "TSS Outlet - mg/l": 10,
    "pH Inlet": 7.1,
    "pH Outlet": 7.3,
    "Total Chlorine - mg/l": 0.8
  },
  {
    "Date:": "2025-04-15",
    "Total Inlet Sewage Received from (MB+Tnk) -m³": 1180,
    "Total Treated Water Produced - m³": 1095,
    "Total TSE Water Output to Irrigation - m³": 980,
    "Power Consumption - kWh": 820,
    "BOD Inlet - mg/l": 290,
    "BOD Outlet - mg/l": 9,
    "COD Inlet - mg/l": 580,
    "COD Outlet - mg/l": 30,
    "TSS Inlet - mg/l": 330,
    "TSS Outlet - mg/l": 11,
    "pH Inlet": 7.0,
    "pH Outlet": 7.2,
    "Total Chlorine - mg/l": 0.7
  },
  {
    "Date:": "2025-04-14",
    "Total Inlet Sewage Received from (MB+Tnk) -m³": 1220,
    "Total Treated Water Produced - m³": 1140,
    "Total TSE Water Output to Irrigation - m³": 1020,
    "Power Consumption - kWh": 835,
    "BOD Inlet - mg/l": 285,
    "BOD Outlet - mg/l": 8.5,
    "COD Inlet - mg/l": 570,
    "COD Outlet - mg/l": 29,
    "TSS Inlet - mg/l": 325,
    "TSS Outlet - mg/l": 10.5,
    "pH Inlet": 7.1,
    "pH Outlet": 7.3,
    "Total Chlorine - mg/l": 0.75
  },
  {
    "Date:": "2025-04-13",
    "Total Inlet Sewage Received from (MB+Tnk) -m³": 1150,
    "Total Treated Water Produced - m³": 1080,
    "Total TSE Water Output to Irrigation - m³": 960,
    "Power Consumption - kWh": 810,
    "BOD Inlet - mg/l": 275,
    "BOD Outlet - mg/l": 8.2,
    "COD Inlet - mg/l": 550,
    "COD Outlet - mg/l": 27,
    "TSS Inlet - mg/l": 315,
    "TSS Outlet - mg/l": 9.8,
    "pH Inlet": 7.2,
    "pH Outlet": 7.4,
    "Total Chlorine - mg/l": 0.78
  },
  {
    "Date:": "2025-04-12",
    "Total Inlet Sewage Received from (MB+Tnk) -m³": 1190,
    "Total Treated Water Produced - m³": 1120,
    "Total TSE Water Output to Irrigation - m³": 990,
    "Power Consumption - kWh": 825,
    "BOD Inlet - mg/l": 282,
    "BOD Outlet - mg/l": 8.3,
    "COD Inlet - mg/l": 565,
    "COD Outlet - mg/l": 28.5,
    "TSS Inlet - mg/l": 322,
    "TSS Outlet - mg/l": 10.2,
    "pH Inlet": 7.1,
    "pH Outlet": 7.3,
    "Total Chlorine - mg/l": 0.77
  }
];

export async function GET(request: NextRequest) {
  try {
    // Return data with 200 OK status
    return NextResponse.json(stpPlantData, { status: 200 });
  } catch (error) {
    // Handle unexpected errors
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
