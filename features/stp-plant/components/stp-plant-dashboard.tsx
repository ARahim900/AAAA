"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useStpData } from "../utils/stp-data";
import { Droplets, Gauge, BarChart2, LineChart2, TrendingUp, Truck, PieChart as PieChartIcon, Calendar } from "lucide-react";

// Color Palette from the existing dashboard
const BASE_COLOR = "#4E4456";
const SECONDARY_COLOR = "#694E5F";
const ACCENT_COLOR = "#8ACCD5";
const INFO_COLOR = "#5BC0DE";
const SUCCESS_COLOR = "#50C878";
const WARNING_COLOR = "#FFB347";
const DANGER_COLOR = "#FF6B6B";
const CHART_COLORS = [ACCENT_COLOR, BASE_COLOR, INFO_COLOR, SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label, unit = "m³" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-[#4E4456] shadow-md rounded-md">
        <p className="font-medium mb-1 text-[#4E4456]">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {Number(entry.value).toLocaleString()} {unit}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// KPI Card Component
function KPICard({ 
  title, 
  value, 
  unit, 
  icon, 
  trendValue, 
  trendLabel 
}: { 
  title: string; 
  value: string | number; 
  unit?: string;
  icon?: React.ReactNode;
  trendValue?: number;
  trendLabel?: string;
}) {
  const formattedValue = typeof value === 'number' 
    ? (value > 1000 ? (value / 1000).toFixed(1) + 'k' : value.toLocaleString()) 
    : value;
  
  const trendColor = trendValue ? (trendValue > 0 ? 'text-green-500' : 'text-red-500') : '';
  const trendIcon = trendValue ? (trendValue > 0 ? '↑' : '↓') : '';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-800">{formattedValue}</span>
        {unit && <span className="ml-1 text-gray-500">{unit}</span>}
      </div>
      {trendValue && (
        <div className={`flex items-center mt-2 text-sm ${trendColor}`}>
          <span>{trendIcon} {Math.abs(trendValue).toFixed(1)}%</span>
          <span className="ml-1 text-gray-500">vs previous {trendLabel || 'period'}</span>
        </div>
      )}
    </div>
  );
}

export default function StpPlantDashboard() {
  const { daily, monthly, isLoading, error } = useStpData();
  const isMobile = useMobile();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  
  // Find the most recent month in the data
  useEffect(() => {
    if (monthly.length > 0 && !selectedMonth) {
      setSelectedMonth(`${monthly[monthly.length - 1].year}-${monthly[monthly.length - 1].month}`);
    }
  }, [monthly, selectedMonth]);

  // Calculate monthly KPIs
  const monthlyKPIs = useMemo(() => {
    if (!selectedMonth || !monthly.length) return null;
    
    const currentMonthIndex = monthly.findIndex(
      m => `${m.year}-${m.month}` === selectedMonth
    );
    
    if (currentMonthIndex === -1) return null;
    
    const currentMonth = monthly[currentMonthIndex];
    const previousMonth = currentMonthIndex > 0 ? monthly[currentMonthIndex - 1] : null;
    
    // Calculate trends
    const getTrend = (current: number, previous: number | undefined) => {
      if (!previous) return 0;
      return ((current - previous) / previous) * 100;
    };
    
    return {
      currentMonth,
      tankerTrips: {
        value: currentMonth.totalTankers,
        trend: getTrend(currentMonth.totalTankers, previousMonth?.totalTankers)
      },
      inletSewage: {
        value: currentMonth.totalInletSewage,
        trend: getTrend(currentMonth.totalInletSewage, previousMonth?.totalInletSewage)
      },
      treatedWater: {
        value: currentMonth.totalTreatedWater,
        trend: getTrend(currentMonth.totalTreatedWater, previousMonth?.totalTreatedWater)
      },
      tseOutput: {
        value: currentMonth.totalTseOutput,
        trend: getTrend(currentMonth.totalTseOutput, previousMonth?.totalTseOutput)
      },
      efficiency: {
        value: currentMonth.avgEfficiency,
        trend: getTrend(currentMonth.avgEfficiency, previousMonth?.avgEfficiency)
      },
      utilizationRate: {
        value: currentMonth.utilizationRate,
        trend: getTrend(currentMonth.utilizationRate, previousMonth?.utilizationRate)
      }
    };
  }, [selectedMonth, monthly]);

  // Filter daily data for the selected month
  const filteredDailyData = useMemo(() => {
    if (!selectedMonth || !daily.length) return [];
    
    const [year, month] = selectedMonth.split('-');
    return daily.filter(record => {
      const date = new Date(record.date);
      return date.getFullYear() === parseInt(year) && 
             date.getMonth() === new Date(month + " 1, 2000").getMonth();
    });
  }, [selectedMonth, daily]);

  // Data for daily trend chart
  const dailyTrendData = useMemo(() => {
    return filteredDailyData.map(record => {
      const date = new Date(record.date);
      return {
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        inlet: record.total_inlet_sewage,
        treated: record.total_treated_water,
        tseOutput: record.total_tse_water_output,
      };
    });
  }, [filteredDailyData]);

  // Data for tanker vs direct sewage source breakdown
  const sourceBreakdownData = useMemo(() => {
    if (!monthlyKPIs) return [];
    const { currentMonth } = monthlyKPIs;
    
    return [
      { 
        name: "Tanker Volume", 
        value: currentMonth.totalTankerVolume, 
        percentage: ((currentMonth.totalTankerVolume / currentMonth.totalInletSewage) * 100).toFixed(1) 
      },
      { 
        name: "Direct Inline Sewage (MB)", 
        value: currentMonth.totalDirectSewage, 
        percentage: ((currentMonth.totalDirectSewage / currentMonth.totalInletSewage) * 100).toFixed(1) 
      },
    ];
  }, [monthlyKPIs]);

  // Data for monthly comparison chart
  const monthlyComparisonData = useMemo(() => {
    return monthly.map(m => ({
      month: m.month.substring(0, 3),
      year: m.year,
      inlet: m.totalInletSewage,
      treated: m.totalTreatedWater,
      tseOutput: m.totalTseOutput,
      efficiency: m.avgEfficiency,
    }));
  }, [monthly]);

  // Data for tanker trips by month
  const tankerTripsData = useMemo(() => {
    return monthly.map(m => ({
      month: m.month.substring(0, 3),
      year: m.year,
      totalTrips: m.totalTankers,
      avgPerDay: m.daysInMonth ? m.totalTankers / m.daysInMonth : 0,
    }));
  }, [monthly]);

  // Capacity utilization data
  const capacityUtilizationData = useMemo(() => {
    return monthly.map(m => ({
      month: m.month.substring(0, 3),
      year: m.year,
      utilization: m.utilizationRate,
      // Calculate proximity to optimal efficiency (90-95% is typically optimal)
      optimalEfficiency: m.avgEfficiency > 95 ? 100 : (m.avgEfficiency / 95) * 100,
    }));
  }, [monthly]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E4456] mx-auto mb-4"></div>
          <p>Loading STP Plant Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#4E4456] py-4">
        <div className="container mx-auto px-6">
          <div className="mb-4 flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Muscat Bay STP Plant Dashboard</h1>
              <p className="text-gray-300 text-sm">Membrane Based Technology - Bio-Reactor MBR | Plant Capacity: 750 m³/day</p>
            </div>
          </div>
          
          {/* Month selector */}
          <div className="flex overflow-x-auto py-2 bg-[#3d3545] rounded-t-lg">
            {monthly.map((m, index) => (
              <button
                key={`${m.year}-${m.month}`}
                onClick={() => setSelectedMonth(`${m.year}-${m.month}`)}
                className={cn(
                  "px-4 py-2 mx-1 whitespace-nowrap rounded",
                  selectedMonth === `${m.year}-${m.month}`
                    ? "bg-[#8ACCD5] text-[#4E4456]"
                    : "bg-transparent text-gray-300 hover:bg-white/10"
                )}
              >
                {m.month.substring(0, 3)} {m.year}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Monthly KPI Cards */}
        {monthlyKPIs && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <KPICard
              title="Monthly Tanker Trips"
              value={monthlyKPIs.tankerTrips.value}
              unit="trips"
              icon={<Truck className="h-5 w-5 text-[#8ACCD5]" />}
              trendValue={monthlyKPIs.tankerTrips.trend}
              trendLabel="month"
            />
            <KPICard
              title="Monthly TSE Water Output"
              value={monthlyKPIs.tseOutput.value}
              unit="m³"
              icon={<Droplets className="h-5 w-5 text-[#8ACCD5]" />}
              trendValue={monthlyKPIs.tseOutput.trend}
              trendLabel="month"
            />
            <KPICard
              title="Total Inlet Sewage"
              value={monthlyKPIs.inletSewage.value}
              unit="m³"
              icon={<TrendingUp className="h-5 w-5 text-[#8ACCD5]" />}
              trendValue={monthlyKPIs.inletSewage.trend}
              trendLabel="month"
            />
            <KPICard
              title="Treatment Efficiency"
              value={monthlyKPIs.efficiency.value.toFixed(1)}
              unit="%"
              icon={<Gauge className="h-5 w-5 text-[#8ACCD5]" />}
              trendValue={monthlyKPIs.efficiency.trend}
              trendLabel="month"
            />
            <KPICard
              title="Plant Utilization Rate"
              value={monthlyKPIs.utilizationRate.value.toFixed(1)}
              unit="%"
              icon={<BarChart2 className="h-5 w-5 text-[#8ACCD5]" />}
              trendValue={monthlyKPIs.utilizationRate.trend}
              trendLabel="month"
            />
            <KPICard
              title="Total Treated Water"
              value={monthlyKPIs.treatedWater.value}
              unit="m³"
              icon={<LineChart2 className="h-5 w-5 text-[#8ACCD5]" />}
              trendValue={monthlyKPIs.treatedWater.trend}
              trendLabel="month"
            />
          </div>
        )}

        {/* Main content with tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Analysis</TabsTrigger>
            <TabsTrigger value="daily">Daily Details</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily water flow trends chart */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Daily Water Flow Trends</h3>
                  <p className="text-sm text-gray-500 mb-4">Inlet, Treated, and TSE Output (m³)</p>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="inlet" 
                          name="Total Inlet" 
                          stroke={WARNING_COLOR} 
                          fill={WARNING_COLOR} 
                          fillOpacity={0.6} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="treated" 
                          name="Treated Water" 
                          stroke={SUCCESS_COLOR} 
                          fill={SUCCESS_COLOR} 
                          fillOpacity={0.6} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="tseOutput" 
                          name="TSE Output" 
                          stroke={INFO_COLOR} 
                          fill={INFO_COLOR} 
                          fillOpacity={0.6} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Inlet source breakdown chart */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Inlet Source Breakdown</h3>
                  <p className="text-sm text-gray-500 mb-4">Tanker vs Direct Inline Sewage</p>
                  <div className="h-72 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={sourceBreakdownData} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={isMobile ? 50 : 70} 
                          outerRadius={isMobile ? 80 : 110} 
                          paddingAngle={3} 
                          dataKey="value" 
                          nameKey="name" 
                          labelLine={false} 
                          label={({ name, percentage }: any) => `${name} (${percentage}%)`}
                        >
                          {sourceBreakdownData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={CHART_COLORS[index % CHART_COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props: any) => [
                          `${Number(value).toLocaleString()} m³ (${props.payload.percentage}%)`, 
                          name
                        ]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly comparison and plant capacity utilization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Monthly Volume Comparison</h3>
                  <p className="text-sm text-gray-500 mb-4">Inlet, Treated, and TSE Output (m³)</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyComparisonData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey={(data) => `${data.month} ${data.year}`}
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="inlet" name="Total Inlet" fill={WARNING_COLOR} />
                        <Bar dataKey="treated" name="Treated Water" fill={SUCCESS_COLOR} />
                        <Bar dataKey="tseOutput" name="TSE Output" fill={INFO_COLOR} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Plant Capacity Utilization</h3>
                  <p className="text-sm text-gray-500 mb-4">Plant Capacity: 750 m³/day</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={capacityUtilizationData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey={(data) => `${data.month} ${data.year}`}
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis yAxisId="left" orientation="left" label={{ value: 'Utilization %', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Efficiency %', angle: -90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="utilization" name="Capacity Utilization %" fill={BASE_COLOR} />
                        <Line yAxisId="right" type="monotone" dataKey="optimalEfficiency" name="Treatment Efficiency %" stroke={ACCENT_COLOR} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plant description and key indicators */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-1">STP Plant Information</h3>
                <p className="text-sm text-gray-500 mb-4">Membrane Based Technology - Bio-Reactor MBR</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-[#4E4456]">Plant Specifications</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Type: Membrane Based Technology - Bio-Reactor (MBR)</li>
                      <li>Design Capacity: 750 m³/day</li>
                      <li>Treatment Stages: Primary, Secondary, and Tertiary</li>
                      <li>Output: Treated Sewage Effluent (TSE) for Irrigation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-[#4E4456]">Operational Highlights</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Dual Inlet Sources: Direct Pipeline and Tanker Delivery</li>
                      <li>Average Daily Flow: {monthlyKPIs ? (monthlyKPIs.inletSewage.value / (monthlyKPIs.currentMonth.daysInMonth || 30)).toFixed(1) : "N/A"} m³/day</li>
                      <li>Average Treatment Efficiency: {monthlyKPIs ? monthlyKPIs.efficiency.value.toFixed(1) : "N/A"}%</li>
                      <li>Average System Utilization: {monthlyKPIs ? monthlyKPIs.utilizationRate.value.toFixed(1) : "N/A"}%</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Monthly Analysis Tab */}
          <TabsContent value="monthly" className="space-y-6">
            {/* Similar content to the original implementation with updated data sources */}
            {/* ... Monthly analysis charts ... */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly water volume chart */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Monthly Water Volumes</h3>
                  <p className="text-sm text-gray-500 mb-4">Comparing Inlet, Treated, and TSE Output</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyComparisonData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey={(data) => `${data.month} ${data.year}`}
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="inlet" name="Total Inlet" fill={WARNING_COLOR} />
                        <Bar dataKey="treated" name="Treated Water" fill={SUCCESS_COLOR} />
                        <Bar dataKey="tseOutput" name="TSE Output" fill={INFO_COLOR} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly efficiency chart */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Monthly Efficiency Analysis</h3>
                  <p className="text-sm text-gray-500 mb-4">Treatment Efficiency over Time</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyComparisonData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey={(data) => `${data.month} ${data.year}`}
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis domain={[80, 100]} label={{ value: 'Efficiency %', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Efficiency']} />
                        <Legend />
                        <Line type="monotone" dataKey="efficiency" name="Treatment Efficiency" stroke={ACCENT_COLOR} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Daily Details Tab */}
          <TabsContent value="daily" className="space-y-6">
            {/* Similar content to the original implementation with updated data sources */}
            {/* ... Daily details charts ... */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily flow chart */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Daily Water Flow Analysis</h3>
                  <p className="text-sm text-gray-500 mb-4">Detail View for Selected Month</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="inlet" name="Total Inlet" stroke={WARNING_COLOR} dot={true} />
                        <Line type="monotone" dataKey="treated" name="Treated Water" stroke={SUCCESS_COLOR} dot={true} />
                        <Line type="monotone" dataKey="tseOutput" name="TSE Output" stroke={INFO_COLOR} dot={true} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Daily tanker discharge chart */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Daily Tanker Discharge</h3>
                  <p className="text-sm text-gray-500 mb-4">Number of Tankers and Volume</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={filteredDailyData.map(d => ({
                        date: new Date(d.date).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric' }),
                        tankers: d.num_tankers_discharged,
                        volume: d.expected_tanker_volume
                      }))} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="tankers" name="Number of Tankers" fill={BASE_COLOR} />
                        <Line yAxisId="right" type="monotone" dataKey="volume" name="Tanker Volume (m³)" stroke={ACCENT_COLOR} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Performance Metrics Tab */}
          <TabsContent value="performance" className="space-y-6">
            {/* Similar content to the original implementation with updated data sources */}
            {/* ... Performance metrics charts ... */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Treatment efficiency trends */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Treatment Efficiency Trends</h3>
                  <p className="text-sm text-gray-500 mb-4">Monthly Performance Analysis</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthly.map(m => ({
                        month: `${m.month.substring(0, 3)} ${m.year}`,
                        efficiency: m.avgEfficiency,
                        tseRate: (m.totalTseOutput / m.totalTreatedWater) * 100
                      }))} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[50, 100]} />
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '']} />
                        <Legend />
                        <Line type="monotone" dataKey="efficiency" name="Treatment Efficiency %" stroke={SUCCESS_COLOR} />
                        <Line type="monotone" dataKey="tseRate" name="TSE Utilization Rate %" stroke={INFO_COLOR} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
