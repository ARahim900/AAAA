"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SideNavigation } from "@/components/layout/side-navigation"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from "recharts"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

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
  Contractor: string
  ServiceProvided: string
  Status: string
  ContractType: string
  StartDate: string | null
  EndDate: string | null
  [key: string]: any
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

// Sample data for charts
const waterConsumptionData = [
  { name: "Oct", L1: 31519, L2: 39285, L3: 30881 },
  { name: "Nov", L1: 35290, L2: 29913, L3: 24719 },
  { name: "Dec", L1: 36733, L2: 32492, L3: 24545 },
  { name: "Jan", L1: 32580, L2: 35325, L3: 27898 },
  { name: "Feb", L1: 44043, L2: 35811, L3: 28369 },
  { name: "Mar", L1: 34915, L2: 39565, L3: 32264 },
];

const electricityConsumptionData = [
  { name: "Oct", consumption: 125000 },
  { name: "Nov", consumption: 118000 },
  { name: "Dec", consumption: 132000 },
  { name: "Jan", consumption: 145000 },
  { name: "Feb", consumption: 138000 },
  { name: "Mar", consumption: 142000 },
];

const stpPerformanceData = [
  { name: "Oct", efficiency: 88 },
  { name: "Nov", efficiency: 86 },
  { name: "Dec", efficiency: 89 },
  { name: "Jan", efficiency: 91 },
  { name: "Feb", efficiency: 90 },
  { name: "Mar", efficiency: 92 },
];

const zoneWaterLossData = [
  { name: "Zone A", loss: 8 },
  { name: "Zone B", loss: 6 },
  { name: "Zone C", loss: 15 },
  { name: "Zone D", loss: 9 },
  { name: "Zone E", loss: 12 },
];

const consumptionByTypeData = [
  { name: "Residential", value: 45 },
  { name: "Commercial", value: 25 },
  { name: "Irrigation", value: 20 },
  { name: "Common Areas", value: 10 },
];

export default function MainDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [waterData, setWaterData] = useState<WaterData[]>([])
  const [electricityData, setElectricityData] = useState<ElectricityRecord[]>([])
  const [stpData, setStpData] = useState<StpRecord[]>([])
  const [contractorsData, setContractorsData] = useState<ContractorRecord[]>([])
  const [isLoading, setIsLoading] = useState({
    water: true,
    electricity: true,
    stp: true,
    contractors: true
  })

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

  // Calculate water metrics
  const waterMetrics = useMemo(() => {
    if (waterData.length === 0) return { totalLoss: 0, supply: 0, consumption: 0, lossPercentage: 0 };
    
    const latestData = waterData[waterData.length - 1];
    const totalLoss = latestData.TotalLoss;
    const supply = latestData.L1;
    const consumption = latestData.L3;
    const lossPercentage = ((totalLoss / supply) * 100).toFixed(1);
    
    return { totalLoss, supply, consumption, lossPercentage };
  }, [waterData]);

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
    if (contractorsData.length === 0) return { activeContracts: 0, expiringSoon: 0, compliance: 0 };
    
    const activeContracts = contractorsData.filter(c => c.Status === "Active").length;
    const expiringSoon = contractorsData.filter(c => c.Status === "Expiring Soon").length;
    
    return { 
      activeContracts, 
      expiringSoon, 
      compliance: 98 // Placeholder value
    };
  }, [contractorsData]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavigation />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-[#4E4456] pt-16 pb-6 px-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Muscat Bay Dashboard</h1>
                <p className="text-purple-100 mt-1">Utility Management System Overview</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <Tabs defaultValue="monthly" value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <TabsList className="grid grid-cols-3 w-[300px]">
                    <TabsTrigger value="weekly" className="text-white">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly" className="text-white">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly" className="text-white">Yearly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          {/* System Performance Overview */}
          <h2 className="text-2xl font-bold text-[#4E4456] mb-6">System Performance Overview</h2>
          
          {/* Utility Module Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Water Module Card */}
            <Link href="/water">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-[#8ACCD5]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#8ACCD5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Water Analytics
                  </CardTitle>
                  <CardDescription>Water supply and consumption metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading.water ? (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Total Loss</p>
                          <p className="text-2xl font-bold text-[#4E4456]">{waterMetrics.lossPercentage}%</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[#8ACCD5]/10 flex items-center justify-center">
                          <span className="text-[#8ACCD5] text-xs font-medium">L1</span>
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-1 bg-[#8ACCD5]" style={{ width: `${Math.min(100, (waterMetrics.consumption / waterMetrics.supply) * 100)}%` }}></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>Supply: {waterMetrics.supply.toLocaleString()} m³</span>
                        <span>Consumption: {waterMetrics.consumption.toLocaleString()} m³</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </Link>

            {/* Electricity Module Card */}
            <Link href="/electricity">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-[#FFB347]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#FFB347]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Electricity Management
                  </CardTitle>
                  <CardDescription>Power consumption and distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading.electricity ? (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Current Usage</p>
                          <p className="text-2xl font-bold text-[#4E4456]">{electricityMetrics.currentUsage.toLocaleString()} kWh</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[#FFB347]/10 flex items-center justify-center">
                          <span className="text-[#FFB347] text-xs font-medium">{electricityMetrics.trend > 0 ? '+' : ''}{electricityMetrics.trend}%</span>
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-1 bg-[#FFB347]" style={{ width: "78%" }}></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>Peak: {electricityMetrics.peak.toLocaleString()} kW</span>
                        <span>Efficiency: {electricityMetrics.efficiency}%</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </Link>

            {/* STP Module Card */}
            <Link href="/stp-plant">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-[#50C878]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#50C878]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    STP Plant
                  </CardTitle>
                  <CardDescription>Sewage treatment performance</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading.stp ? (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Efficiency</p>
                          <p className="text-2xl font-bold text-[#4E4456]">{stpMetrics.efficiency}%</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[#50C878]/10 flex items-center justify-center">
                          <span className="text-[#50C878] text-xs font-medium">{stpMetrics.trend > 0 ? '+' : ''}{stpMetrics.trend.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-1 bg-[#50C878]" style={{ width: `${stpMetrics.efficiency}%` }}></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>Flow: {stpMetrics.flow.toLocaleString()} m³/day</span>
                        <span>Quality: {stpMetrics.quality}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </Link>

            {/* Contractor Module Card */}
            <Link href="/contractors">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-[#5BC0DE]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#5BC0DE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Contractor Tracker
                  </CardTitle>
                  <CardDescription>Contractor agreements and status</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading.contractors ? (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Active Contracts</p>
                          <p className="text-2xl font-bold text-[#4E4456]">{contractorMetrics.activeContracts}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[#5BC0DE]/10 flex items-center justify-center">
                          <span className="text-[#5BC0DE] text-xs font-medium">{contractorMetrics.expiringSoon}</span>
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-1 bg-[#5BC0DE]" style={{ width: "45%" }}></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>Expiring soon: {contractorMetrics.expiringSoon}</span>
                        <span>Compliance: {contractorMetrics.compliance}%</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
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
                      <LineChart data={waterConsumptionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
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
                      <BarChart data={electricityConsumptionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="consumption" fill={WARNING_COLOR} name="Consumption (kWh)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* STP Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>STP Plant Efficiency</CardTitle>
                <CardDescription>Treatment efficiency over time</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading.stp ? (
                  <div className="flex justify-center items-center h-60">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stpPerformanceData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[70, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="efficiency" stroke={SUCCESS_COLOR} name="Efficiency (%)" strokeWidth={2} />
                        <ReferenceLine y={85} stroke="red" strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Zone Water Loss Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Zone Water Loss</CardTitle>
                <CardDescription>Loss percentage by zone</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading.water ? (
                  <div className="flex justify-center items-center h-60">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={zoneWaterLossData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false} />
                        <XAxis type="number" domain={[0, 20]} />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="loss" fill={DANGER_COLOR} name="Loss (%)">
                          {zoneWaterLossData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.loss > 10 ? DANGER_COLOR : ACCENT_COLOR} />
                          ))}
                        </Bar>
                        <ReferenceLine x={10} stroke="red" strokeDasharray="3 3" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Consumption by Type Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Consumption by Type</CardTitle>
                <CardDescription>Distribution of water usage</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading.water ? (
                  <div className="flex justify-center items-center h-60">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <>
                    <div className="h-60 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={consumptionByTypeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {consumptionByTypeData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={[BASE_COLOR, SECONDARY_COLOR, ACCENT_COLOR, NEUTRAL_COLOR][index % 4]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {consumptionByTypeData.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: [BASE_COLOR, SECONDARY_COLOR, ACCENT_COLOR, NEUTRAL_COLOR][index] }}
                          />
                          <span className="text-xs">{item.name}: {item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Alerts and Activities Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent issues requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start p-3 rounded-lg bg-gray-50">
                      <div 
                        className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${alert.severity === 'high' ? 'bg-red-500' : alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{alert.description}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-gray-400">{alert.timestamp}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${alert.module === 'water' ? 'bg-[#8ACCD5]/10 text-[#8ACCD5]' : alert.module === 'electricity' ? 'bg-[#FFB347]/10 text-[#FFB347]' : alert.module === 'stp' ? 'bg-[#50C878]/10 text-[#50C878]' : 'bg-[#5BC0DE]/10 text-[#5BC0DE]'}`}>
                            {alert.module === 'water' ? 'Water' : alert.module === 'electricity' ? 'Electricity' : alert.module === 'stp' ? 'STP Plant' : 'Contractors'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start p-3 rounded-lg bg-gray-50">
                      <div className="w-8 h-8 rounded-full bg-[#4E4456]/10 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#4E4456]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{activity.action}</h4>
                        <p className="text-xs text-gray-500 mt-1">By {activity.user}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-gray-400">{activity.timestamp}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${activity.module === 'water' ? 'bg-[#8ACCD5]/10 text-[#8ACCD5]' : activity.module === 'electricity' ? 'bg-[#FFB347]/10 text-[#FFB347]' : activity.module === 'stp' ? 'bg-[#50C878]/10 text-[#50C878]' : 'bg-[#5BC0DE]/10 text-[#5BC0DE]'}`}>
                            {activity.module === 'water' ? 'Water' : activity.module === 'electricity' ? 'Electricity' : activity.module === 'stp' ? 'STP Plant' : 'Contractors'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
