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
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import StpPlantDataTable from "./stp-plant-data-table";

// Color Palette
const BASE_COLOR = "#4E4456";
const SECONDARY_COLOR = "#694E5F";
const ACCENT_COLOR = "#8ACCD5";
const INFO_COLOR = "#5BC0DE";
const SUCCESS_COLOR = "#50C878";
const WARNING_COLOR = "#FFB347";
const DANGER_COLOR = "#FF6B6B";
const CHART_COLORS = [ACCENT_COLOR, BASE_COLOR, INFO_COLOR, SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR];

interface StpRecord {
  "Date:": string;
  "Number of Tankers Discharged:": string | number;
  "Expected Tanker Volume (m³³) (20 m3)": number;
  "Direct In line Sewage (MB)": number;
  "Total Inlet Sewage Received from (MB+Tnk) -m³": number;
  "Total Treated Water Produced - m³": number;
  "Total TSE Water Output to Irrigation - m³": number;
}

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

export default function StpPlantDashboard() {
  const [stpData, setStpData] = useState<StpRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDateRange, setSelectedDateRange] = useState<{ startDate: string | null; endDate: string | null }>({ startDate: null, endDate: null });
  const isMobile = useMobile();

  useEffect(() => {
    fetch("/api/stp-plant-data")
      .then((res) => res.json())
      .then((data: StpRecord[]) => {
        const cleanedData = data.map(record => ({
          ...record,
          "Date:": record["Date:"] ? new Date(record["Date:"]?.split("/").reverse().join("-")).toLocaleDateString("en-CA") : "Invalid Date",
          "Number of Tankers Discharged:": Number(String(record["Number of Tankers Discharged:"]).replace(/,/g, ".")) || 0,
        }));
        setStpData(cleanedData.sort((a,b) => new Date(a["Date:"]).getTime() - new Date(b["Date:"]).getTime()));
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching STP Plant data:", error);
        setIsLoading(false);
      });
  }, []);

  const filteredStpData = useMemo(() => {
    if (!selectedDateRange.startDate || !selectedDateRange.endDate) {
      return stpData;
    }
    return stpData.filter(record => {
      const recordDate = new Date(record["Date:"]);
      return recordDate >= new Date(selectedDateRange.startDate!) && recordDate <= new Date(selectedDateRange.endDate!);
    });
  }, [stpData, selectedDateRange]);

  const summaryMetrics = useMemo(() => {
    if (filteredStpData.length === 0) {
      return {
        totalInletSewage: 0,
        totalTreatedWater: 0,
        totalTseOutput: 0,
        averageDailyInlet: 0,
        treatmentEfficiency: 0,
      };
    }
    const totalInlet = filteredStpData.reduce((sum, record) => sum + record["Total Inlet Sewage Received from (MB+Tnk) -m³"], 0);
    const totalTreated = filteredStpData.reduce((sum, record) => sum + record["Total Treated Water Produced - m³"], 0);
    const totalTse = filteredStpData.reduce((sum, record) => sum + record["Total TSE Water Output to Irrigation - m³"], 0);
    const numDays = filteredStpData.length;

    return {
      totalInletSewage: totalInlet,
      totalTreatedWater: totalTreated,
      totalTseOutput: totalTse,
      averageDailyInlet: numDays > 0 ? totalInlet / numDays : 0,
      treatmentEfficiency: totalInlet > 0 ? (totalTreated / totalInlet) * 100 : 0,
    };
  }, [filteredStpData]);

  const dailyTrendData = useMemo(() => {
    return filteredStpData.map(record => ({
      date: new Date(record["Date:"]).toLocaleDateString("en-GB", { day: "2-digit", month: "short"}),
      inlet: record["Total Inlet Sewage Received from (MB+Tnk) -m³"],
      treated: record["Total Treated Water Produced - m³"],
      tseOutput: record["Total TSE Water Output to Irrigation - m³"],
    }));
  }, [filteredStpData]);

  const sourceBreakdownData = useMemo(() => {
    if (filteredStpData.length === 0) return [];
    const totalTankerVolume = filteredStpData.reduce((sum, record) => sum + record["Expected Tanker Volume (m³³) (20 m3)"], 0);
    const totalDirectSewage = filteredStpData.reduce((sum, record) => sum + record["Direct In line Sewage (MB)"], 0);
    const totalInlet = totalTankerVolume + totalDirectSewage;
    if (totalInlet === 0) return [];
    return [
      { name: "Tanker Volume", value: totalTankerVolume, percentage: ((totalTankerVolume / totalInlet) * 100).toFixed(1) },
      { name: "Direct Inline Sewage (MB)", value: totalDirectSewage, percentage: ((totalDirectSewage / totalInlet) * 100).toFixed(1) },
    ];
  }, [filteredStpData]);

  const uniqueDates = useMemo(() => {
    return [...new Set(stpData.map(d => d["Date:"]))].sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
  }, [stpData]);

  useEffect(() => {
    if (uniqueDates.length > 0 && (!selectedDateRange.startDate || !selectedDateRange.endDate)) {
        setSelectedDateRange({ startDate: uniqueDates[0], endDate: uniqueDates[uniqueDates.length - 1]});
    }
  }, [uniqueDates, selectedDateRange]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading STP Plant Data...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section styled to match water dashboard */}
      <div className="bg-[#4E4456] py-4">
        <div className="container mx-auto px-6">
          <div className="mb-4 flex items-center">
            <img src="/logo.png" alt="Muscat Bay Logo" className="h-12 w-auto mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-white">Muscat Bay STP Plant Management</h1>
              <p className="text-gray-300 text-sm">Advanced Real-time Analytics Dashboard</p>
            </div>
          </div>

          {/* Date range selectors in the header */}
          {uniqueDates.length > 0 && (
            <div className="flex justify-end items-center mb-4">
              <div className="flex items-center">
                <span className="text-white mr-2">Date Range:</span>
                <select 
                  value={selectedDateRange.startDate || ""}
                  onChange={(e) => setSelectedDateRange(prev => ({...prev, startDate: e.target.value}))}
                  className="bg-white/10 text-white border border-white/20 rounded px-2 py-1 mr-2"
                >
                  {uniqueDates.map(date => (
                    <option key={`start-${date}`} value={date}>
                      {new Date(date).toLocaleDateString("en-GB")}
                    </option>
                  ))}
                </select>
                <span className="text-white mx-2">to</span>
                <select 
                  value={selectedDateRange.endDate || ""}
                  onChange={(e) => setSelectedDateRange(prev => ({...prev, endDate: e.target.value}))}
                  className="bg-white/10 text-white border border-white/20 rounded px-2 py-1"
                >
                  {uniqueDates.map(date => (
                    <option key={`end-${date}`} value={date}>
                      {new Date(date).toLocaleDateString("en-GB")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {/* Date timeline */}
          <div className="flex overflow-x-auto py-2 bg-[#3d3545] rounded-t-lg">
            {uniqueDates.slice(-7).map(date => (
              <button
                key={date}
                onClick={() => setSelectedDateRange({startDate: date, endDate: date})}
                className={`px-4 py-2 mx-1 whitespace-nowrap rounded 
                  ${(selectedDateRange.startDate === date && selectedDateRange.endDate === date) 
                    ? 'bg-[#8ACCD5] text-[#4E4456]' 
                    : 'bg-transparent text-gray-300 hover:bg-white/10'}`}
              >
                {new Date(date).toLocaleDateString("en-GB", {day: "2-digit", month: "short"})}
              </button>
            ))}
            <button
              onClick={() => setSelectedDateRange({startDate: uniqueDates[0], endDate: uniqueDates[uniqueDates.length - 1]})}
              className={`px-4 py-2 mx-1 whitespace-nowrap rounded 
                ${(selectedDateRange.startDate === uniqueDates[0] && selectedDateRange.endDate === uniqueDates[uniqueDates.length - 1]) 
                  ? 'bg-[#8ACCD5] text-[#4E4456]' 
                  : 'bg-transparent text-gray-300 hover:bg-white/10'}`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <div className="flex -mb-px">
              {["Overview", "Detailed Data", "Performance"].map(tab => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <KPICard 
                title="Total Inlet Sewage"
                value={summaryMetrics.totalInletSewage}
                unit="m³"
              />
              <KPICard 
                title="Total Treated Water"
                value={summaryMetrics.totalTreatedWater}
                unit="m³"
              />
              <KPICard 
                title="Total TSE Output"
                value={summaryMetrics.totalTseOutput}
                unit="m³"
              />
              <KPICard 
                title="Avg. Daily Inlet"
                value={Number(summaryMetrics.averageDailyInlet.toFixed(2))}
                unit="m³/day"
              />
              <KPICard 
                title="Treatment Efficiency"
                value={Number(summaryMetrics.treatmentEfficiency.toFixed(2))}
                unit="%"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Daily Water Flow Trends</h3>
                  <p className="text-sm text-gray-500 mb-4">Inlet, Treated, and TSE Output (m³)</p>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area type="monotone" dataKey="inlet" name="Total Inlet" stackId="1" stroke={WARNING_COLOR} fill={WARNING_COLOR} fillOpacity={0.6} />
                        <Area type="monotone" dataKey="treated" name="Treated Water" stackId="1" stroke={SUCCESS_COLOR} fill={SUCCESS_COLOR} fillOpacity={0.6} />
                        <Area type="monotone" dataKey="tseOutput" name="TSE Output" stackId="1" stroke={INFO_COLOR} fill={INFO_COLOR} fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Inlet Source Breakdown</h3>
                  <p className="text-sm text-gray-500 mb-4">Total for selected period</p>
                  <div className="h-96 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sourceBreakdownData} cx="50%" cy="50%" innerRadius={isMobile ? 50 : 70} outerRadius={isMobile ? 80 : 110} paddingAngle={3} dataKey="value" nameKey="name" labelLine={false} label={({ name, percentage }) => `${name} (${percentage}%)`}>
                          {sourceBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${Number(value).toLocaleString()} m³ (${props.payload.percentage}%)`, name]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Detailed Data tab content */}
        {activeTab === "detailed-data" && (
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-1">Detailed STP Data Log</h3>
              <p className="text-sm text-gray-500 mb-4">Raw data with search, sort, and filter options for the selected date range.</p>
              <StpPlantDataTable initialData={filteredStpData} />
            </CardContent>
          </Card>
        )}
        
        {/* Performance tab content */}
        {activeTab === "performance" && (
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-1">Performance Metrics</h3>
              <p className="text-gray-600 mt-4">The current dataset provides daily inlet, treated, and TSE output volumes. Key performance indicators (KPIs) like overall treatment efficiency are calculated and displayed in the Overview tab. More advanced performance metrics could include:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Consistency of treatment efficiency over time.</li>
                <li>Comparison against target efficiency rates (if available).</li>
                <li>Analysis of tanker discharge patterns and their impact on inlet volumes.</li>
                <li>Water reuse rate (TSE Output vs. Treated Water Produced).</li>
              </ul>
              <p className="text-gray-600 mt-4">Further development of this section would benefit from more granular data (e.g., hourly flows, specific quality parameters of inlet/outlet water) or defined operational targets.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
