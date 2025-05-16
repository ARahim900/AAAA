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
import { DashboardCard } from "@/components/ui/dashboard-card";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import ElectricityDataTable from "./electricity-data-table"; // Added import

// Color Palette
const BASE_COLOR = "#4E4456";
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

export default function ElectricityDashboard() { // Renamed from ElectricityDashboardNew for consistency
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

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div
        className="relative overflow-hidden"
        style={{
          background: BASE_COLOR,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Muscat Bay Logo" className="h-12 w-auto" /> 
              <div>
                <h1 className="text-3xl font-bold text-white">Muscat Bay Electricity Management</h1>
                <p className="text-purple-100 mt-1">Advanced Real-time Analytics Dashboard</p>
              </div>
            </div>
             {monthColumns.length > 0 && (
                <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 mt-4 md:mt-0"
                >
                    {monthColumns.map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex overflow-x-auto scrollbar-hide h-auto border-b border-gray-200">
            {["Overview", "Consumption Details", "Cost Analysis", "Trends"].map(tabName => (
              <TabsTrigger
                key={tabName.toLowerCase().replace(" ", "-")}
                value={tabName.toLowerCase().replace(" ", "-")}
                className="px-4 py-3 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5] focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                {tabName}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard title="Total Consumption" value={summaryMetrics.totalConsumption.toLocaleString()} unit="kWh" />
              <DashboardCard title="Peak Demand (Current Month)" value={summaryMetrics.peakDemand.toLocaleString()} unit="kW" />
              <DashboardCard title="Avg. Consumption / Meter" value={summaryMetrics.averageConsumptionPerMeter.toFixed(2)} unit="kWh" />
              <DashboardCard title="Number of Meters" value={summaryMetrics.numberOfMeters.toString()} unit="" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <SectionHeader title="Consumption Trend" description="Monthly electricity consumption in kWh" />
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
              <Card>
                <CardContent className="p-6">
                  <SectionHeader title="Usage Breakdown by Type" description={`Distribution for ${selectedMonth}`} />
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
          </TabsContent>

          <TabsContent value="consumption-details" className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-6">
                <SectionHeader title="Detailed Consumption Data" description="Raw data table with search, sort, and filter options for all meters and months." />
                <ElectricityDataTable initialData={electricityData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cost-analysis" className="space-y-6 mt-6">
            <Card>
                <CardContent className="p-6">
                    <SectionHeader title="Cost Analysis" />
                    <p className="text-gray-600 mt-4">Detailed cost analysis requires unit cost data (e.g., cost per kWh), which is not currently available in the provided dataset. Future enhancements could include integrating tariff information to calculate and visualize electricity costs.</p>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trends" className="space-y-6 mt-6">
            <Card>
                <CardContent className="p-6">
                    <SectionHeader title="Advanced Trends" />
                    <p className="text-gray-600 mt-4">The "Overview" tab provides a monthly consumption trend. More advanced trend analysis, such as year-over-year comparisons, seasonal decomposition, or forecasting, would require more extensive historical data and specialized analytical models. This section can be expanded as more data becomes available.</p>
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

