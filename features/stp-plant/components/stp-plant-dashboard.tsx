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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import StpPlantDataTable from "./stp-plant-data-table"; // Ensure this is correctly imported

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
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Improved Header with gradient background */}
      <div 
        className="relative overflow-hidden" 
        style={{ 
          background: `linear-gradient(135deg, ${BASE_COLOR} 0%, ${SECONDARY_COLOR} 100%)`, 
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" 
        }}
      >
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Muscat Bay Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-3xl font-bold text-white">Muscat Bay STP Plant Management</h1>
                <p className="text-purple-100 mt-1">Advanced Real-time Analytics Dashboard</p>
              </div>
            </div>
            {uniqueDates.length > 0 && (
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <select 
                        value={selectedDateRange.startDate || ""}
                        onChange={(e) => setSelectedDateRange(prev => ({...prev, startDate: e.target.value}))}
                        className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                        {uniqueDates.map(date => <option key={`start-${date}`} value={date}>{new Date(date).toLocaleDateString("en-GB")}</option>)}
                    </select>
                    <span className="text-white">to</span>
                    <select 
                        value={selectedDateRange.endDate || ""}
                        onChange={(e) => setSelectedDateRange(prev => ({...prev, endDate: e.target.value}))}
                        className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                        {uniqueDates.map(date => <option key={`end-${date}`} value={date}>{new Date(date).toLocaleDateString("en-GB")}</option>)}
                    </select>
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex overflow-x-auto scrollbar-hide h-auto border-b border-gray-200">
            {["Overview", "Detailed Data", "Performance"].map(tabName => (
              <TabsTrigger 
                key={tabName.toLowerCase().replace(" ", "-")} 
                value={tabName.toLowerCase().replace(" ", "-")} 
                className="px-4 py-3 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5] focus-visible:ring-0"
              >
                {tabName}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard 
                title="Total Inlet Sewage" 
                value={summaryMetrics.totalInletSewage.toLocaleString()} 
                unit="m³" 
                mainValue={summaryMetrics.totalInletSewage}
                mainValueUnit="m³"
              />
              <DashboardCard 
                title="Total Treated Water" 
                value={summaryMetrics.totalTreatedWater.toLocaleString()} 
                unit="m³" 
                mainValue={summaryMetrics.totalTreatedWater}
                mainValueUnit="m³"
              />
              <DashboardCard 
                title="Total TSE Output" 
                value={summaryMetrics.totalTseOutput.toLocaleString()} 
                unit="m³" 
                mainValue={summaryMetrics.totalTseOutput}
                mainValueUnit="m³"
              />
              <DashboardCard 
                title="Avg. Daily Inlet" 
                value={summaryMetrics.averageDailyInlet.toFixed(2)} 
                unit="m³/day" 
                mainValue={parseFloat(summaryMetrics.averageDailyInlet.toFixed(2))}
                mainValueUnit="m³/day"
              />
              <DashboardCard 
                title="Treatment Efficiency" 
                value={summaryMetrics.treatmentEfficiency.toFixed(2)} 
                unit="%" 
                mainValue={parseFloat(summaryMetrics.treatmentEfficiency.toFixed(2))}
                mainValueUnit="%"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <SectionHeader title="Daily Water Flow Trends" description="Inlet, Treated, and TSE Output (m³)" />
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
              <Card>
                <CardContent className="p-6">
                  <SectionHeader title="Inlet Source Breakdown" description={`Total for selected period`} />
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
          </TabsContent>

          <TabsContent value="detailed-data" className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-6">
                <SectionHeader title="Detailed STP Data Log" description="Raw data with search, sort, and filter options for the selected date range." />
                <StpPlantDataTable initialData={filteredStpData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6 mt-6">
             <Card>
                <CardContent className="p-6">
                    <SectionHeader title="Performance Metrics" />
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
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
