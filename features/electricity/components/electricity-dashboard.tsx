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
import ElectricityDataTable from "./electricity-data-table";

// Color Palette
const BASE_COLOR = "#4E4456";
const SECONDARY_COLOR = "#694E5F";
const ACCENT_COLOR = "#8ACCD5";
const INFO_COLOR = "#5BC0DE";
const SUCCESS_COLOR = "#50C878";
const WARNING_COLOR = "#FFB347";
const DANGER_COLOR = "#FF6B6B";
const CHART_COLORS = [ACCENT_COLOR, BASE_COLOR, INFO_COLOR, SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR];

interface ElectricityRecord {
  Name: string;
  Type: string;
  "Meter Account No.": string | null;
  [monthYear: string]: number | string | null;
}

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

// KPI Card Component to Match Water Dashboard
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

export default function ElectricityDashboard() {
  const [electricityData, setElectricityData] = useState<ElectricityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useMobile();

  useEffect(() => {
    fetch("/api/electricity-data")
      .then((res) => res.json())
      .then((data) => {
        setElectricityData(data);
        if (data.length > 0) {
          const sampleRecord = data[0];
          const monthKeys = Object.keys(sampleRecord).filter(key => key.includes("-") && !isNaN(new Date("01-" + key.replace("-", "-20")).getMonth()));
          if (monthKeys.length > 0) {
            const sortedMonthKeys = monthKeys.sort((a, b) => {
                const [m1, y1] = a.split("-");
                const [m2, y2] = b.split("-");
                const dateA = new Date(`20${y1}`, new Date(`${m1} 1, 2000`).getMonth());
                const dateB = new Date(`20${y2}`, new Date(`${m2} 1, 2000`).getMonth());
                return dateB.getTime() - dateA.getTime(); // Sort descending for latest first
            });
            setSelectedMonth(sortedMonthKeys[0]);
          }
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching electricity data:", error);
        setIsLoading(false);
      });
  }, []);

  const monthColumns = useMemo(() => {
    if (electricityData.length === 0) return [];
    return Object.keys(electricityData[0]).filter(
      (key) => key.includes("-") && !isNaN(Number(electricityData[0][key]))
    ).sort((a, b) => {
        const [m1, y1] = a.split("-");
        const [m2, y2] = b.split("-");
        const dateA = new Date(`20${y1}`, new Date(`${m1} 1, 2000`).getMonth());
        const dateB = new Date(`20${y2}`, new Date(`${m2} 1, 2000`).getMonth());
        return dateA.getTime() - dateB.getTime(); // Sort ascending for trends
    });
  }, [electricityData]);

  useEffect(() => {
    if (monthColumns.length > 0 && !selectedMonth) {
      setSelectedMonth(monthColumns[monthColumns.length - 1]);
    }
  }, [monthColumns, selectedMonth]);

  const summaryMetrics = useMemo(() => {
    if (!selectedMonth || electricityData.length === 0) {
      return {
        totalConsumption: 0,
        peakDemand: 0,
        averageConsumptionPerMeter: 0,
        numberOfMeters: 0,
      };
    }
    let totalConsumption = 0;
    let activeMeters = 0;
    electricityData.forEach(record => {
      const consumption = Number(record[selectedMonth]);
      if (!isNaN(consumption)) {
        totalConsumption += consumption;
        activeMeters++;
      }
    });
    return {
      totalConsumption,
      peakDemand: electricityData.reduce((max, record) => Math.max(max, Number(record[selectedMonth]) || 0), 0),
      averageConsumptionPerMeter: activeMeters > 0 ? totalConsumption / activeMeters : 0,
      numberOfMeters: electricityData.length,
    };
  }, [electricityData, selectedMonth]);

  const consumptionTrendData = useMemo(() => {
    return monthColumns.map(month => ({
      month,
      consumption: electricityData.reduce((sum, record) => sum + (Number(record[month]) || 0), 0),
    }));
  }, [electricityData, monthColumns]);

  const usageBreakdownByTypeData = useMemo(() => {
    if (!selectedMonth || electricityData.length === 0) return [];
    const breakdown: { [key: string]: number } = {};
    electricityData.forEach(record => {
      const type = record.Type || "Unknown";
      const consumption = Number(record[selectedMonth]);
      if (!isNaN(consumption)) {
        breakdown[type] = (breakdown[type] || 0) + consumption;
      }
    });
    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    return Object.entries(breakdown).map(([name, value]) => ({ name, value, percentage: total > 0 ? ((value / total) * 100).toFixed(1) : "0" }));
  }, [electricityData, selectedMonth]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading Electricity Data...</p>
      </div>
    );
  }

  // Format for month selector to match water dashboard
  const formattedMonth = selectedMonth ? 
    `${selectedMonth.split('-')[0]}-${selectedMonth.split('-')[1].length === 2 ? '20' + selectedMonth.split('-')[1] : selectedMonth.split('-')[1]}` : "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section styled to match water dashboard */}
      <div className="bg-[#4E4456] py-4">
        <div className="container mx-auto px-6">
          <div className="mb-4 flex items-center">
            <img src="/logo.png" alt="Muscat Bay Logo" className="h-12 w-auto mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-white">Muscat Bay Electricity Management</h1>
              <p className="text-gray-300 text-sm">Advanced Real-time Analytics Dashboard</p>
            </div>
          </div>

          {/* Month selector in the header */}
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center">
              <span className="text-white mr-2">Month:</span>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white/10 text-white border border-white/20 rounded px-2 py-1"
              >
                {monthColumns.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Month timeline */}
          <div className="flex overflow-x-auto py-2 bg-[#3d3545] rounded-t-lg">
            {monthColumns.map(month => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-4 py-2 mx-1 whitespace-nowrap rounded 
                  ${selectedMonth === month ? 'bg-[#8ACCD5] text-[#4E4456]' : 'bg-transparent text-gray-300 hover:bg-white/10'}`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <div className="flex -mb-px">
              {["Overview", "Consumption Details", "Cost Analysis", "Trends"].map(tab => (
                <button
                  key={tab.toLowerCase().replace(" ", "-")}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(" ", "-"))}
                  className={`mr-1 py-3 px-4 text-sm font-medium 
                    ${activeTab === tab.toLowerCase().replace(" ", "-") 
                      ? "border-b-2 border-[#8ACCD5] text-[#4E4456]" 
                      : "text-gray-500 hover:text-[#8ACCD5]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overview tab content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard 
                title="Total Consumption"
                value={summaryMetrics.totalConsumption}
                unit="kWh"
              />
              <KPICard 
                title="Peak Demand (Current Month)"
                value={summaryMetrics.peakDemand}
                unit="kW"
              />
              <KPICard 
                title="Avg. Consumption / Meter"
                value={Number(summaryMetrics.averageConsumptionPerMeter.toFixed(2))}
                unit="kWh"
              />
              <KPICard 
                title="Number of Meters"
                value={summaryMetrics.numberOfMeters}
              />
            </div>

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
                        <Line type="monotone" dataKey="consumption" name="Total Consumption (kWh)" stroke={ACCENT_COLOR} strokeWidth={2} dot={{ r: 4, strokeWidth: 1, fill: ACCENT_COLOR }} activeDot={{ r: 6, fill: BASE_COLOR, stroke: BASE_COLOR }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Usage Breakdown by Type</h3>
                  <p className="text-sm text-gray-500 mb-4">Distribution for {selectedMonth}</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={usageBreakdownByTypeData} cx="50%" cy="50%" innerRadius={isMobile ? 40 : 60} outerRadius={isMobile ? 60 : 90} paddingAngle={2} dataKey="value" nameKey="name" labelLine={false} label={({ name, percentage }) => `${name} (${percentage}%)`}>
                          {usageBreakdownByTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${Number(value).toLocaleString()} kWh (${props.payload.percentage}%)`, name]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Consumption Details tab content */}
        {activeTab === "consumption-details" && (
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-1">Detailed Consumption Data</h3>
              <p className="text-sm text-gray-500 mb-4">Raw data table with search, sort, and filter options for all meters and months.</p>
              <ElectricityDataTable initialData={electricityData} />
            </CardContent>
          </Card>
        )}
        
        {/* Cost Analysis tab content */}
        {activeTab === "cost-analysis" && (
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-1">Cost Analysis</h3>
              <p className="text-gray-600 mt-4">Detailed cost analysis requires unit cost data (e.g., cost per kWh), which is not currently available in the provided dataset. Future enhancements could include integrating tariff information to calculate and visualize electricity costs.</p>
            </CardContent>
          </Card>
        )}

        {/* Trends tab content */}
        {activeTab === "trends" && (
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-1">Advanced Trends</h3>
              <p className="text-gray-600 mt-4">The "Overview" tab provides a monthly consumption trend. More advanced trend analysis, such as year-over-year comparisons, seasonal decomposition, or forecasting, would require more extensive historical data and specialized analytical models. This section can be expanded as more data becomes available.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
