"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from "recharts"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"

// Define the base color and generate a color palette
const BASE_COLOR = "#4E4456"
const SECONDARY_COLOR = "#8A7A94"
const ACCENT_COLOR = "#8ACCD5"
const SUCCESS_COLOR = "#50C878"
const WARNING_COLOR = "#FFB347"
const DANGER_COLOR = "#FF6B6B"
const INFO_COLOR = "#5BC0DE"
const NEUTRAL_COLOR = "#ADB5BD"

// Interface definitions for data types
interface WaterData {
  month: string
  L1: number
  L2: number
  L3: number
  DC: number // Direct connections from main
  Stage01Loss: number
  Stage02Loss: number
  TotalLoss: number
}

interface ElectricityRecord {
  [key: string]: any
}

interface StpRecord {
  "Date:": string
  "Total Inlet Sewage Received from (MB+Tnk) -m³": number
  "Total Treated Water Produced - m³": number
  "Total TSE Water Output to Irrigation - m³": number
  [key: string]: any
}

interface ContractorRecord {
  id: string
  name: string
  contractType: string
  startDate: string
  endDate: string
  status: 'Active' | 'Expired' | 'Expiring Soon'
  value: number
}

interface WasteManagementData {
  date: string
  generalWaste: number
  recyclableWaste: number
  organicWaste: number 
  hazardousWaste: number
  totalCollected: number
  recyclingRate: number
}

// Recent alerts data
const recentAlerts = [
  {
    id: 1,
    title: "High Water Loss Detected",
    description: "Zone C showing 15% water loss, above threshold of 10%",
    severity: "high",
    timestamp: "2 hours ago",
    module: "water",
  },
  {
    id: 2,
    title: "Electricity Consumption Spike",
    description: "Unusual consumption pattern detected in Building 3",
    severity: "medium",
    timestamp: "5 hours ago",
    module: "electricity",
  },
  {
    id: 3,
    title: "STP Maintenance Required",
    description: "Filter replacement needed within 48 hours",
    severity: "medium",
    timestamp: "1 day ago",
    module: "stp",
  },
  {
    id: 4,
    title: "Contractor Agreement Expiring",
    description: "Maintenance contract #MC-2023-45 expires in 15 days",
    severity: "low",
    timestamp: "2 days ago",
    module: "contractors",
  },
]

// Recent activities data
const recentActivities = [
  {
    id: 1,
    action: "Updated meter readings",
    user: "Admin User",
    timestamp: "1 hour ago",
    module: "water",
  },
  {
    id: 2,
    action: "Generated monthly report",
    user: "System",
    timestamp: "3 hours ago",
    module: "electricity",
  },
  {
    id: 3,
    action: "Scheduled maintenance",
    user: "Maintenance Manager",
    timestamp: "Yesterday",
    module: "stp",
  },
  {
    id: 4,
    action: "Added new contractor",
    user: "Admin User",
    timestamp: "2 days ago",
    module: "contractors",
  },
]

const consumptionByTypeData = [
  { name: "Residential", value: 45 },
  { name: "Commercial", value: 25 },
  { name: "Irrigation", value: 20 },
  { name: "Common Areas", value: 10 },
];

interface MainDashboardProps {
  selectedPeriod?: string;
}

export default function MainDashboard({ selectedPeriod = "monthly" }: MainDashboardProps) {
  const [waterData, setWaterData] = useState<WaterData[]>([]);
  const [electricityData, setElectricityData] = useState<ElectricityRecord[]>([]);
  const [stpData, setStpData] = useState<StpRecord[]>([]);
  const [contractorsData, setContractorsData] = useState<ContractorRecord[]>([]);
  const [wasteManagementData, setWasteManagementData] = useState<WasteManagementData[]>([]);
  const [isLoading, setIsLoading] = useState({
    water: true,
    electricity: true,
    stp: true,
    contractors: true,
    waste: true
  });

  // Fetch water data
  useEffect(() => {
    const fetchWaterData = async () => {
      try {
        const response = await fetch("/api/water-data");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setWaterData(data);
        setIsLoading(prev => ({ ...prev, water: false }));
      } catch (error) {
        console.error("Error fetching water data:", error);
        setIsLoading(prev => ({ ...prev, water: false }));
      }
    };

    fetchWaterData();
  }, [selectedPeriod]);

  // Fetch electricity data
  useEffect(() => {
    const fetchElectricityData = async () => {
      try {
        const response = await fetch("/api/electricity-data");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setElectricityData(data);
        setIsLoading(prev => ({ ...prev, electricity: false }));
      } catch (error) {
        console.error("Error fetching electricity data:", error);
        setIsLoading(prev => ({ ...prev, electricity: false }));
      }
    };

    fetchElectricityData();
  }, [selectedPeriod]);

  // Fetch STP data
  useEffect(() => {
    const fetchStpData = async () => {
      try {
        const response = await fetch("/api/stp-plant-data");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStpData(data);
        setIsLoading(prev => ({ ...prev, stp: false }));
      } catch (error) {
        console.error("Error fetching STP data:", error);
        setIsLoading(prev => ({ ...prev, stp: false }));
      }
    };

    fetchStpData();
  }, [selectedPeriod]);

  // Fetch contractors data
  useEffect(() => {
    const fetchContractorsData = async () => {
      try {
        const response = await fetch("/api/contractors-data");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setContractorsData(data);
        setIsLoading(prev => ({ ...prev, contractors: false }));
      } catch (error) {
        console.error("Error fetching contractors data:", error);
        setIsLoading(prev => ({ ...prev, contractors: false }));
      }
    };

    fetchContractorsData();
  }, [selectedPeriod]);

  // Fetch waste management data
  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const response = await fetch("/api/waste-management-data");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setWasteManagementData(data);
        setIsLoading(prev => ({ ...prev, waste: false }));
      } catch (error) {
        console.error("Error fetching waste data:", error);
        setIsLoading(prev => ({ ...prev, waste: false }));
      }
    };

    fetchWasteData();
  }, [selectedPeriod]);

  // Calculate water metrics
  const waterMetrics = useMemo(() => {
    if (waterData.length === 0) return { totalLoss: 0, supply: 0, consumption: 0, lossPercentage: 0, stage1Loss: 0, stage2Loss: 0 };
    
    const latestData = waterData[waterData.length - 1];
    const totalLoss = latestData.TotalLoss;
    const supply = latestData.L1;
    const consumption = latestData.L3;
    const lossPercentage = supply > 0 ? ((totalLoss / supply) * 100).toFixed(1) : "0";
    
    return { 
      totalLoss, 
      supply, 
      consumption, 
      lossPercentage: parseFloat(lossPercentage),
      stage1Loss: latestData.Stage01Loss,
      stage2Loss: latestData.Stage02Loss
    };
  }, [waterData]);

  const zoneWaterLossData = useMemo(() => {
    if (!waterMetrics || waterMetrics.stage1Loss === undefined || waterMetrics.stage2Loss === undefined) {
      return [
        { name: "Stage 1 Loss", value: 0, color: "#FF8042" },
        { name: "Stage 2 Loss", value: 0, color: "#FFBB28" },
      ];
    }
    return [
      { name: "Stage 1 Loss", value: waterMetrics.stage1Loss, color: "#FF8042" },
      { name: "Stage 2 Loss", value: waterMetrics.stage2Loss, color: "#FFBB28" },
    ];
  }, [waterMetrics]);

  // Calculate electricity metrics
  const electricityMetrics = useMemo(() => {
    if (electricityData.length === 0) return { currentUsage: 0, peak: 0, efficiency: 0, trend: 0 };
    
    // Get the latest month data
    const monthKeys = Object.keys(electricityData[0]).filter(key => key.includes("-"));
    if (monthKeys.length === 0) return { currentUsage: 0, peak: 0, efficiency: 0, trend: 0 };
    
    const latestMonth = monthKeys[monthKeys.length - 1];
    const previousMonth = monthKeys[monthKeys.length - 2] || latestMonth;
    
    // Calculate total consumption for the latest month
    const currentUsage = electricityData.reduce((sum, record) => {
      const value = Number(record[latestMonth]) || 0;
      return sum + value;
    }, 0);
    
    // Calculate total consumption for the previous month
    const previousUsage = electricityData.reduce((sum, record) => {
      const value = Number(record[previousMonth]) || 0;
      return sum + value;
    }, 0);
    
    // Calculate trend percentage
    const trend = previousUsage > 0 ? ((currentUsage - previousUsage) / previousUsage) * 100 : 0;
    
    // Find peak consumption
    const peak = electricityData.reduce((max, record) => {
      const value = Number(record[latestMonth]) || 0;
      return Math.max(max, value);
    }, 0);
    
    return { 
      currentUsage, 
      peak, 
      efficiency: 92, // Placeholder value
      trend: parseFloat(trend.toFixed(1))
    };
  }, [electricityData]);

  // Calculate STP metrics
  const stpMetrics = useMemo(() => {
    if (stpData.length === 0) return { efficiency: 0, flow: 0, quality: "N/A", trend: 0 };
    
    // Sort data by date (descending)
    const sortedData = [...stpData].sort((a, b) => {
      return new Date(b["Date:"]).getTime() - new Date(a["Date:"]).getTime();
    });
    
    // Get the latest and previous records
    const latestRecord = sortedData[0];
    const previousRecord = sortedData[1] || latestRecord;
    
    // Calculate efficiency
    const inlet = latestRecord["Total Inlet Sewage Received from (MB+Tnk) -m³"];
    const treated = latestRecord["Total Treated Water Produced - m³"];
    const efficiency = inlet > 0 ? (treated / inlet) * 100 : 0;
    
    // Calculate previous efficiency for trend
    const prevInlet = previousRecord["Total Inlet Sewage Received from (MB+Tnk) -m³"];
    const prevTreated = previousRecord["Total Treated Water Produced - m³"];
    const prevEfficiency = prevInlet > 0 ? (prevTreated / prevInlet) * 100 : 0;
    
    // Calculate trend
    const trend = prevEfficiency > 0 ? ((efficiency - prevEfficiency) / prevEfficiency) * 100 : 0;
    
    return { 
      efficiency: parseFloat(efficiency.toFixed(1)), 
      flow: inlet, 
      quality: "High", // Placeholder value
      trend: parseFloat(trend.toFixed(1))
    };
  }, [stpData]);

  // Calculate contractor metrics
  const contractorMetrics = useMemo(() => {
    if (contractorsData.length === 0) return { activeContracts: 0, expiringSoon: 0, compliance: 0, expiredContracts: 0 };
    
    const activeContracts = contractorsData.filter(c => c.status === "Active").length;
    const expiringSoon = contractorsData.filter(c => c.status === "Expiring Soon").length;
    const expiredContracts = contractorsData.filter(c => c.status === "Expired").length;
    
    return { 
      activeContracts, 
      expiringSoon,
      expiredContracts,
      compliance: 98 // Placeholder value
    };
  }, [contractorsData]);
  
  const wasteManagementMetrics = useMemo(() => {
    if (!wasteManagementData.length) return { totalCollected: 0, recyclingRate: 0, trend: 0 };
    
    const latestMonth = wasteManagementData[wasteManagementData.length - 1];
    const previousMonth = wasteManagementData.length > 1 ? wasteManagementData[wasteManagementData.length - 2] : null;
    
    return {
      totalCollected: latestMonth.totalCollected,
      recyclingRate: latestMonth.recyclingRate,
      trend: previousMonth ? (latestMonth.recyclingRate - previousMonth.recyclingRate) : 0,
    };
  }, [wasteManagementData]);

  return (
    <>
      {/* System Performance Overview */}
      <h2 className="text-2xl font-bold text-[#4E4456] mb-6">System Performance Overview</h2>
      
      {/* Utility Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Water Module Card */}
        <Link href="/water" className="block hover:shadow-lg transition-shadow rounded-lg">
          {isLoading.water ? (
            <Card className="h-full flex items-center justify-center border-l-4 border-l-sky-500">
              <CardContent className="py-10">
                <LoadingSpinner size="md" />
              </CardContent>
            </Card>
          ) : (
            <DashboardCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>}
              title="Water Analytics"
              description="Water supply and consumption metrics"
              mainValueLabel="Total Loss"
              mainValue={waterMetrics.lossPercentage}
              mainValueUnit="%"
              statusText={Number(waterMetrics.lossPercentage) > 10 ? "Above threshold" : "Within target"}
              statusColorClass={Number(waterMetrics.lossPercentage) > 10 ? "text-red-600" : "text-green-600"}
              className="h-full relative" // Added relative for positioning the L1 badge
            >
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center">
                <span className="text-sky-600 text-xs font-medium">L1</span>
              </div>
              <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: `${waterMetrics.supply > 0 ? Math.min(100, (waterMetrics.consumption / waterMetrics.supply) * 100) : 0}%` }}></div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Supply: {waterMetrics.supply.toLocaleString()} m³</span>
                <span>Consumption: {waterMetrics.consumption.toLocaleString()} m³</span>
              </div>
            </DashboardCard>
          )}
        </Link>

        {/* Electricity Module Card */}
        <Link href="/electricity" className="block hover:shadow-lg transition-shadow rounded-lg">
          {isLoading.electricity ? (
            <Card className="h-full flex items-center justify-center border-l-4 border-l-amber-500">
              <CardContent className="py-10">
                <LoadingSpinner size="md" />
              </CardContent>
            </Card>
          ) : (
            <DashboardCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>}
              title="Electricity Management"
              description="Power consumption and distribution"
              mainValueLabel="Current Usage"
              mainValue={electricityMetrics.currentUsage}
              mainValueUnit="kWh"
              trendValue={electricityMetrics.trend}
              trendLabel="vs last period"
              className="h-full relative"
            >
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-amber-600 text-xs font-medium">{electricityMetrics.efficiency}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${electricityMetrics.peak > 0 ? Math.min(100, (electricityMetrics.currentUsage / (electricityMetrics.peak * 1.2)) * 100) : 0}%` }}></div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Efficiency: {electricityMetrics.efficiency}%</span>
                <span>Peak: {electricityMetrics.peak.toLocaleString()} kWh</span>
              </div>
            </DashboardCard>
          )}
        </Link>

        {/* STP Plant Module Card */}
        <Link href="/stp-plant" className="block hover:shadow-lg transition-shadow rounded-lg">
          {isLoading.stp ? (
            <Card className="h-full flex items-center justify-center border-l-4 border-l-emerald-500">
              <CardContent className="py-10">
                <LoadingSpinner size="md" />
              </CardContent>
            </Card>
          ) : (
            <DashboardCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>}
              title="STP Plant"
              description="Sewage treatment performance"
              mainValueLabel="Efficiency"
              mainValue={stpMetrics.efficiency}
              mainValueUnit="%"
              trendValue={stpMetrics.trend} 
              trendLabel={stpMetrics.trend >= 0 ? "increase" : "decrease"}
              className="h-full relative"
            >
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-600 text-xs font-medium">{stpMetrics.quality}</span>
              </div>
              <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, stpMetrics.efficiency)}%` }}></div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Daily Flow: {(stpMetrics.flow / 30).toFixed(1)} m³/day</span>
                <span>Monthly: {stpMetrics.flow.toLocaleString()} m³</span>
              </div>
            </DashboardCard>
          )}
        </Link>

        {/* Contractor Tracker Card */}
        <Link href="/contractors" className="block hover:shadow-lg transition-shadow rounded-lg">
          {isLoading.contractors ? (
            <Card className="h-full flex items-center justify-center border-l-4 border-l-cyan-500">
              <CardContent className="py-10">
                <LoadingSpinner size="md" />
              </CardContent>
            </Card>
          ) : (
            <DashboardCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>}
              title="Contractor Tracker"
              description="Contractor agreements and status"
              mainValueLabel="Active Contracts"
              mainValue={contractorMetrics.activeContracts}
              statusText={contractorMetrics.expiringSoon > 0 ? `${contractorMetrics.expiringSoon} contracts expiring soon` : "All contracts up to date"}
              statusColorClass={contractorMetrics.expiringSoon > 0 ? "text-amber-600" : "text-gray-500"}
              className="h-full relative"
            >
              <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mt-1 flex space-x-2">
                <span className="px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Active: {contractorMetrics.activeContracts}</span>
                <span className={cn(
                  "px-2 py-0.5 text-xs font-semibold rounded-full",
                  contractorMetrics.expiringSoon > 0 ? "text-amber-700 bg-amber-100" : "text-gray-700 bg-gray-100"
                )}>
                  Expiring: {contractorMetrics.expiringSoon}
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded-full">Expired: {contractorMetrics.expiredContracts || 0}</span>
              </div>
            </DashboardCard>
          )}
        </Link>
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Water Supply vs Consumption Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Water Supply vs Consumption</CardTitle>
            <CardDescription>Trend analysis with loss percentage</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading.water ? (
              <div className="flex justify-center items-center h-80">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waterData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="L1" stroke={BASE_COLOR} name="Supply (L1)" strokeWidth={2} />
                    <Line type="monotone" dataKey="L2" stroke={SECONDARY_COLOR} name="Distribution (L2)" strokeWidth={2} />
                    <Line type="monotone" dataKey="L3" stroke={ACCENT_COLOR} name="Consumption (L3)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Electricity Consumption Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Electricity Consumption</CardTitle>
            <CardDescription>Monthly consumption patterns</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading.electricity ? (
              <div className="flex justify-center items-center h-80">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {electricityData.length > 0 ? (
                    <BarChart 
                      data={Object.keys(electricityData[0])
                        .filter(key => key.includes("-") && !isNaN(Number(electricityData[0][key])))
                        .slice(-6) // Get the last 6 months
                        .map(month => ({
                          name: month,
                          consumption: electricityData.reduce((sum, record) => sum + (Number(record[month]) || 0), 0)
                        }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="consumption" fill={WARNING_COLOR} name="Consumption (kWh)" />
                    </BarChart>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p>No electricity data available</p>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System alerts from all utility modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                      alert.severity === "high" ? "bg-red-100 text-red-600" :
                      alert.severity === "medium" ? "bg-yellow-100 text-yellow-600" :
                      "bg-blue-100 text-blue-600"
                    )}>
                      {alert.severity === "high" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : alert.severity === "medium" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <span className="text-xs text-gray-500">{alert.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      <div className="flex items-center mt-2">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          alert.module === "water" ? "bg-[#8ACCD5]/10 text-[#8ACCD5]" :
                          alert.module === "electricity" ? "bg-[#FFB347]/10 text-[#FFB347]" :
                          alert.module === "stp" ? "bg-[#50C878]/10 text-[#50C878]" :
                          "bg-[#5BC0DE]/10 text-[#5BC0DE]"
                        )}>
                          {alert.module.charAt(0).toUpperCase() + alert.module.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current status of all utility systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Water System</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Operational</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Electricity System</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Operational</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-medium">STP Plant</span>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Maintenance</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Contractor System</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Operational</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Waste Management</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
