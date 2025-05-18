"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SideNavigation } from "@/components/layout/side-navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface WasteManagementData {
  date: string
  generalWaste: number
  recyclableWaste: number
  organicWaste: number 
  hazardousWaste: number
  totalCollected: number
  recyclingRate: number
}

export default function WasteManagementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [data, setData] = useState<WasteManagementData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/waste-management-data")
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const result = await response.json()
        setData(result)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching waste management data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedPeriod])

  // Calculate metrics
  const calculateMetrics = () => {
    if (data.length === 0) {
      return {
        totalCollected: 0,
        recyclingRate: 0,
        trend: 0
      }
    }

    const latestMonth = data[data.length - 1]
    const previousMonth = data.length > 1 ? data[data.length - 2] : null

    return {
      totalCollected: latestMonth.totalCollected,
      recyclingRate: latestMonth.recyclingRate,
      trend: previousMonth ? (latestMonth.recyclingRate - previousMonth.recyclingRate) : 0
    }
  }

  const metrics = calculateMetrics()

  // Generate solid waste composition data for pie chart
  const wasteCompositionData = data.length > 0 
    ? [
        { name: "General Waste", value: data[data.length - 1].generalWaste, color: "#ADB5BD" },
        { name: "Recyclable Waste", value: data[data.length - 1].recyclableWaste, color: "#50C878" },
        { name: "Organic Waste", value: data[data.length - 1].organicWaste, color: "#8ACCD5" },
        { name: "Hazardous Waste", value: data[data.length - 1].hazardousWaste, color: "#FF6B6B" }
      ]
    : []

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavigation />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-[#4E4456] pt-8 pb-6 px-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Waste Management</h1>
                <p className="text-purple-100 mt-1">Waste collection and recycling analytics</p>
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
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  Total Waste Collected
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-[#4E4456]">{metrics.totalCollected.toLocaleString()} kg</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Recycling Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-[#4E4456]">{metrics.recyclingRate.toFixed(1)}%</div>
                    <div className={`ml-2 text-sm px-2 py-1 rounded-full ${metrics.trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {metrics.trend > 0 ? '+' : ''}{metrics.trend.toFixed(1)}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Hazardous Waste
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-[#4E4456]">
                    {data.length > 0 ? data[data.length - 1].hazardousWaste.toLocaleString() : 0} kg
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Waste Collection Trends</CardTitle>
                <CardDescription>Monthly collection volume by waste type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString('en-US', { month: 'short' });
                        }} 
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="generalWaste" name="General Waste" stackId="a" fill="#ADB5BD" />
                      <Bar dataKey="recyclableWaste" name="Recyclable Waste" stackId="a" fill="#50C878" />
                      <Bar dataKey="organicWaste" name="Organic Waste" stackId="a" fill="#8ACCD5" />
                      <Bar dataKey="hazardousWaste" name="Hazardous Waste" stackId="a" fill="#FF6B6B" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recycling Rate Progress</CardTitle>
                <CardDescription>Monthly recycling rate trends</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString('en-US', { month: 'short' });
                        }} 
                      />
                      <YAxis domain={[0, 40]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="recyclingRate" 
                        name="Recycling Rate (%)" 
                        stroke="#50C878" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Waste Composition Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Waste Composition</CardTitle>
                <CardDescription>Current waste composition breakdown</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteCompositionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {wasteCompositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Waste Management Summary</CardTitle>
                <CardDescription>Key indicators and trends</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center h-60">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Recyclable Waste Collection</h3>
                      <div className="flex items-center">
                        <div className="text-xl font-semibold">
                          {data.length > 0 ? data[data.length - 1].recyclableWaste.toLocaleString() : 0} kg
                        </div>
                        <div className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          {data.length > 1 
                            ? (((data[data.length - 1].recyclableWaste - data[data.length - 2].recyclableWaste) / 
                                data[data.length - 2].recyclableWaste) * 100).toFixed(1) 
                            : 0}%
                        </div>
                      </div>
                      <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${(data.length > 0 ? data[data.length - 1].recyclableWaste / data[data.length - 1].totalCollected : 0) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Organic Waste Collection</h3>
                      <div className="flex items-center">
                        <div className="text-xl font-semibold">
                          {data.length > 0 ? data[data.length - 1].organicWaste.toLocaleString() : 0} kg
                        </div>
                        <div className="ml-2 text-xs px-2 py-1 rounded-full bg-cyan-100 text-cyan-800">
                          {data.length > 1 
                            ? (((data[data.length - 1].organicWaste - data[data.length - 2].organicWaste) / 
                                data[data.length - 2].organicWaste) * 100).toFixed(1) 
                            : 0}%
                        </div>
                      </div>
                      <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: `${(data.length > 0 ? data[data.length - 1].organicWaste / data[data.length - 1].totalCollected : 0) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Waste Diversion Rate</h3>
                      <div className="text-xl font-semibold">
                        {data.length > 0 
                          ? (((data[data.length - 1].recyclableWaste + data[data.length - 1].organicWaste) / 
                              data[data.length - 1].totalCollected) * 100).toFixed(1) 
                          : 0}%
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Percentage of waste diverted from landfill
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
