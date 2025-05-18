"use client"

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
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useElectricityData, processElectricityDataForDisplay } from "../utils/electricity-data";
import ElectricityDataTable from "./electricity-data-table";
import { Zap, Cpu, BarChart2, LineChart2, Clock, Activity } from "lucide-react";

// Color Palette
const BASE_COLOR = "#4E4456";
const SECONDARY_COLOR = "#694E5F";
const ACCENT_COLOR = "#8ACCD5";
const INFO_COLOR = "#5BC0DE";
const SUCCESS_COLOR = "#50C878";
const WARNING_COLOR = "#FFB347";
const DANGER_COLOR = "#FF6B6B";
const CHART_COLORS = [ACCENT_COLOR, BASE_COLOR, INFO_COLOR, SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-[#4E4456] shadow-md rounded-md">
        <p className="font-medium mb-1 text-[#4E4456]">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {Number(entry.value).toLocaleString()} kWh
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// KPI Card Component
function KPICard({ title, value, unit, icon, trendValue, trendLabel }: { 
  title: string; 
  value: string | number; 
  unit?: string;
  icon?: React.ReactNode;
  trendValue?: number;
  trendLabel?: string;
}) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
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

// Data Filter component
interface DataFilterProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

const DataFilter = ({ label, options, value, onChange, className }: DataFilterProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label className="text-sm font-medium text-white">{label}:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
        aria-label={`Select ${label}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function ElectricityDashboard() {
  const { consumption, zoneSummary, monthlyTrends, highConsumptionUnits, isLoading, error } = useElectricityData();
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useMobile();

  // Process consumption data for display in the data table and charts
  useEffect(() => {
    if (consumption.length > 0) {
      const processedData = processElectricityDataForDisplay(consumption);
      setTableData(processedData);
      
      // Set the default selected month (most recent)
      if (!selectedMonth && monthlyTrends.length > 0) {
        setSelectedMonth(monthlyTrends[monthlyTrends.length - 1].month_year);
      }
    }
  }, [consumption, monthlyTrends, selectedMonth]);

  // Available month columns for selector
  const monthOptions = useMemo(() => {
    return monthlyTrends.map(m => ({
      value: m.month_year,
      label: m.month_year,
    }));
  }, [monthlyTrends]);

  // Calculate summary metrics for the selected month
  const summaryMetrics = useMemo(() => {
    // Find the selected month in monthly trends
    const selectedTrend = monthlyTrends.find(m => m.month_year === selectedMonth);
    
    if (!selectedTrend) {
      return {
        totalConsumption: 0,
        peakDemand: 0,
        averageConsumptionPerMeter: 0,
        numberOfMeters: 0,
      };
    }
    
    // Calculate the average per meter (if we have zone summary data)
    const relevantZoneSummaries = zoneSummary.filter(z => z.month_year === selectedMonth);
    const totalMeters = relevantZoneSummaries.reduce((sum, zone) => sum + zone.meters_count, 0);
    
    return {
      totalConsumption: selectedTrend.total_consumption,
      peakDemand: selectedTrend.peak_demand,
      averageConsumptionPerMeter: totalMeters > 0 ? 
        selectedTrend.total_consumption / totalMeters : 0,
      numberOfMeters: totalMeters,
      percentageChange: selectedTrend.percentage_change
    };
  }, [selectedMonth, monthlyTrends, zoneSummary]);

  // Consumption trend data for charts
  const consumptionTrendData = useMemo(() => {
    return monthlyTrends.map(trend => ({
      month: trend.month_year,
      consumption: trend.total_consumption,
      peakDemand: trend.peak_demand,
      temperature: trend.avg_temperature
    }));
  }, [monthlyTrends]);

  // Zone breakdown data for pie chart
  const zoneBreakdownData = useMemo(() => {
    if (!selectedMonth) return [];
    
    const relevantZones = zoneSummary.filter(z => z.month_year === selectedMonth);
    const total = relevantZones.reduce((sum, zone) => sum + zone.total_consumption, 0);
    
    return relevantZones.map(zone => ({
      name: zone.zone_name,
      value: zone.total_consumption,
      percentage: total > 0 ? ((zone.total_consumption / total) * 100).toFixed(1) : "0"
    }));
  }, [selectedMonth, zoneSummary]);

  // High consumption units data
  const highConsumptionData = useMemo(() => {
    if (!selectedMonth) return [];
    
    return highConsumptionUnits
      .filter(unit => unit.month_year === selectedMonth)
      .sort((a, b) => b.consumption_value - a.consumption_value)
      .slice(0, 5);
  }, [selectedMonth, highConsumptionUnits]);

  // Zone options for filter
  const zoneOptions = [
    { value: "all", label: "All Zones" },
    { value: "Zone01", label: "Zone 01" },
    { value: "Zone02", label: "Zone 02" },
    { value: "Zone03", label: "Zone 03" },
    { value: "Zone04", label: "Zone 04" },
    { value: "Zone05", label: "Zone 05" },
  ];
  const [selectedZone, setSelectedZone] = useState("all");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E4456] mx-auto mb-4"></div>
          <p>Loading Electricity Data...</p>
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
      {/* Enhanced Header with gradient background */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${BASE_COLOR} 0%, ${SECONDARY_COLOR} 100%)`,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-6 relative z-10">
          {/* Header Content */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Muscat Bay Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-3xl font-bold text-white">Muscat Bay Electricity Management</h1>
                <p className="text-purple-100 mt-1">Advanced Real-time Analytics Dashboard</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
              {/* Filters Section - Reorganized */}
              <div className="flex flex-wrap gap-3">
                <DataFilter
                  label="Month"
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  className="bg-white/10 rounded-lg px-3 py-2 text-white"
                />

                <DataFilter
                  label="Zone"
                  options={zoneOptions}
                  value={selectedZone}
                  onChange={setSelectedZone}
                  className="bg-white/10 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Time Range Slider with white text */}
          <div className="mt-2">
            <div className="w-full px-4">
              <input
                type="range"
                min={0}
                max={monthOptions.length - 1}
                value={monthOptions.findIndex(m => m.value === selectedMonth)}
                onChange={(e) => setSelectedMonth(monthOptions[Number(e.target.value)].value)}
                className="w-full h-2 bg-gradient-to-r from-[#8ACCD5] to-[#8ACCD5] rounded-lg appearance-none cursor-pointer"
                aria-label="Time range slider"
              />
              <div className="flex justify-between mt-2 text-xs text-white">
                {monthOptions.filter((_, i) => i % 2 === 0 || i === monthOptions.length - 1).map((month, index) => (
                  <span key={index} className={selectedMonth === month.value ? "font-bold text-white bg-[#4E4456] px-2 py-1 rounded" : ""}>
                    {month.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard 
            title="Total Consumption"
            value={summaryMetrics.totalConsumption}
            unit="kWh"
            icon={<Zap className="h-5 w-5 text-[#8ACCD5]" />}
            trendValue={summaryMetrics.percentageChange}
            trendLabel="month"
          />
          <KPICard 
            title="Peak Demand"
            value={summaryMetrics.peakDemand}
            unit="kW"
            icon={<Activity className="h-5 w-5 text-[#8ACCD5]" />}
          />
          <KPICard 
            title="Avg. Consumption / Meter"
            value={Number(summaryMetrics.averageConsumptionPerMeter.toFixed(2))}
            unit="kWh"
            icon={<Cpu className="h-5 w-5 text-[#8ACCD5]" />}
          />
          <KPICard 
            title="Number of Meters"
            value={summaryMetrics.numberOfMeters}
            icon={<Clock className="h-5 w-5 text-[#8ACCD5]" />}
          />
        </div>

        {/* Tabs navigation */}
        <Tabs 
          defaultValue="overview" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consumption-details">Consumption Details</TabsTrigger>
            <TabsTrigger value="zone-analysis">Zone Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Overview tab content */}
          <TabsContent value="overview" className="space-y-8">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Consumption Trend</h3>
                  <p className="text-sm text-gray-500 mb-4">Monthly electricity consumption in kWh</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={consumptionTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="consumption" 
                          name="Total Consumption (kWh)" 
                          stroke={ACCENT_COLOR} 
                          strokeWidth={2} 
                          dot={{ r: 4, strokeWidth: 1, fill: ACCENT_COLOR }} 
                          activeDot={{ r: 6, fill: BASE_COLOR, stroke: BASE_COLOR }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Zone Consumption Breakdown</h3>
                  <p className="text-sm text-gray-500 mb-4">Distribution for {selectedMonth}</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={zoneBreakdownData} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={isMobile ? 40 : 60} 
                          outerRadius={isMobile ? 60 : 90} 
                          paddingAngle={2} 
                          dataKey="value" 
                          nameKey="name" 
                          labelLine={false} 
                          label={({ name, percentage }: any) => `${name} (${percentage}%)`}
                        >
                          {zoneBreakdownData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={CHART_COLORS[index % CHART_COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props: any) => [
                          `${Number(value).toLocaleString()} kWh (${props.payload.percentage}%)`, 
                          name
                        ]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Highest consumption units */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-1">Highest Consumption Units</h3>
                <p className="text-sm text-gray-500 mb-4">Top 5 units by electricity usage for {selectedMonth}</p>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={highConsumptionData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="unit_name" 
                        width={90}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} kWh`, '']} />
                      <Legend />
                      <Bar dataKey="consumption_value" name="Consumption (kWh)" fill={BASE_COLOR}>
                        {highConsumptionData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consumption Details tab content */}
          <TabsContent value="consumption-details">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-1">Detailed Consumption Data</h3>
                <p className="text-sm text-gray-500 mb-4">Raw data table with search, sort, and filter options for all meters and months.</p>
                <ElectricityDataTable initialData={tableData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Zone Analysis tab content */}
          <TabsContent value="zone-analysis">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-1">Zone Analysis</h3>
                <p className="text-sm text-gray-500 mb-4">Detailed breakdown by zone</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone Name</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Consumption (kWh)</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Meters Count</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Consumption (kWh)</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {zoneSummary
                        .filter(zone => zone.month_year === selectedMonth)
                        .map((zone, index) => {
                          const totalConsumption = zoneSummary
                            .filter(z => z.month_year === selectedMonth)
                            .reduce((sum, z) => sum + z.total_consumption, 0);
                          
                          const percentOfTotal = (zone.total_consumption / totalConsumption * 100).toFixed(1);
                          
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{zone.zone_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{zone.total_consumption.toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{zone.meters_count}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{zone.avg_consumption.toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{percentOfTotal}%</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                
                {/* Zone comparison chart */}
                <div className="h-80 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={zoneSummary.filter(zone => zone.month_year === selectedMonth)} 
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="zone_name" />
                      <YAxis yAxisId="left" orientation="left" label={{ value: 'Consumption (kWh)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Meters Count', angle: -90, position: 'insideRight' }} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="total_consumption" name="Total Consumption (kWh)" fill={BASE_COLOR} />
                      <Bar yAxisId="right" dataKey="meters_count" name="Number of Meters" fill={ACCENT_COLOR} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends tab content */}
          <TabsContent value="trends">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-1">Consumption and Demand Trends</h3>
                <p className="text-sm text-gray-500 mb-4">Historical trends for consumption and peak demand</p>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={consumptionTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="consumption" 
                        name="Consumption (kWh)" 
                        stroke={BASE_COLOR} 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="peakDemand" 
                        name="Peak Demand (kW)" 
                        stroke={ACCENT_COLOR} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Temperature impact chart (if available) */}
                {consumptionTrendData.some(d => d.temperature !== null) && (
                  <div className="mt-10">
                    <h3 className="text-lg font-semibold mb-1">Temperature vs. Consumption Correlation</h3>
                    <p className="text-sm text-gray-500 mb-4">Impact of average temperature on electricity consumption</p>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                          data={consumptionTrendData.filter(d => d.temperature !== null)} 
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" orientation="left" />
                          <YAxis yAxisId="right" orientation="right" domain={[20, 50]} />
                          <Tooltip />
                          <Legend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="consumption" 
                            name="Consumption (kWh)" 
                            stroke={BASE_COLOR} 
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="temperature" 
                            name="Avg. Temperature (°C)" 
                            stroke="#FF8042" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
