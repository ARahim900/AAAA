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

// Function to lighten a color (matching water dashboard)
const lightenColor = (color: string, amount: number) => {
  const num = Number.parseInt(color.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + 255 * amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + 255 * amount);
  const b = Math.min(255, (num & 0xff) + 255 * amount);
  return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
};

// Generate gradient string for CSS (matching water dashboard)
const generateGradient = (color1: string, color2: string, direction = "to right") => {
  return `linear-gradient(${direction}, ${color1}, ${color2})`;
};

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

// Data Filter Component
interface DataFilterProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const DataFilter = ({ label, options, value, onChange, className }: DataFilterProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-100 border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        aria-label={`Select ${label}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default function ElectricityDashboard() {
  const { consumption, zoneSummary, monthlyTrends, highConsumptionUnits, isLoading, error } = useElectricityData();
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [activeView, setActiveView] = useState("overview");
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
  const monthColumns = useMemo(() => {
    return monthlyTrends.map(m => m.month_year);
  }, [monthlyTrends]);

  // Generate month options for filter dropdown
  const monthOptions = useMemo(() => {
    return monthColumns.map(month => ({
      value: month,
      label: month
    }));
  }, [monthColumns]);

  // Zone options for filter
  const zoneOptions = [
    { value: "all", label: "All Zones" },
    { value: "Zone01", label: "Zone 01" },
    { value: "Zone02", label: "Zone 02" },
    { value: "Zone03", label: "Zone 03" },
    { value: "Zone04", label: "Zone 04" },
    { value: "Zone05", label: "Zone 05" },
  ];

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
    <div>
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-4">
          <DataFilter
            label="Month"
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
          />

          <DataFilter
            label="Zone"
            options={zoneOptions}
            value={selectedZone}
            onChange={setSelectedZone}
          />
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Key Metrics Section - Simplified cards to match water dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">Total Consumption</h3>
            <p className="text-3xl font-bold mt-2" style={{ color: BASE_COLOR }}>
              {summaryMetrics.totalConsumption.toLocaleString()} kWh
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">Peak Demand</h3>
            <p className="text-3xl font-bold mt-2" style={{ color: BASE_COLOR }}>
              {summaryMetrics.peakDemand.toLocaleString()} kW
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">Avg. Per Meter</h3>
            <p className="text-3xl font-bold mt-2" style={{ color: BASE_COLOR }}>
              {Number(summaryMetrics.averageConsumptionPerMeter.toFixed(2)).toLocaleString()} kWh
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">Number of Meters</h3>
            <p className="text-3xl font-bold mt-2" style={{ color: BASE_COLOR }}>
              {summaryMetrics.numberOfMeters.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Simplified */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveView("overview")}
            className={`px-4 py-2 font-medium text-sm ${activeView === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView("consumption-details")}
            className={`px-4 py-2 font-medium text-sm ${activeView === "consumption-details" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Consumption Details
          </button>
          <button
            onClick={() => setActiveView("zone-analysis")}
            className={`px-4 py-2 font-medium text-sm ${activeView === "zone-analysis" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Zone Analysis
          </button>
          <button
            onClick={() => setActiveView("trends")}
            className={`px-4 py-2 font-medium text-sm ${activeView === "trends" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Trends
          </button>
        </div>

        {/* Overview View */}
        {activeView === "overview" && (
          <div>
            {/* Main Chart - Showing consumption distribution - Similar to water dashboard */}
            <div className="bg-white p-5 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Electricity Consumption Distribution - {selectedMonth}</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[{
                      month: selectedMonth,
                      totalConsumption: summaryMetrics.totalConsumption,
                      peakDemand: summaryMetrics.peakDemand,
                      avgPerMeter: summaryMetrics.averageConsumptionPerMeter
                    }]} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalConsumption" name="Total Consumption (kWh)" fill={BASE_COLOR} />
                    <Bar dataKey="peakDemand" name="Peak Demand (kW)" fill={ACCENT_COLOR} />
                    <Bar dataKey="avgPerMeter" name="Avg. Per Meter (kWh)" fill={SUCCESS_COLOR} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Zone Distribution Chart */}
            <div className="bg-white p-5 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Zone Distribution - {selectedMonth}</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={zoneBreakdownData} 
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} kWh`, '']} />
                    <Legend />
                    <Bar dataKey="value" name="Consumption (kWh)" fill={ACCENT_COLOR} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Consumption Details View */}
        {activeView === "consumption-details" && (
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-1">Detailed Consumption Data</h3>
            <p className="text-sm text-gray-500 mb-4">Raw data table with search, sort, and filter options for all meters and months.</p>
            <ElectricityDataTable initialData={tableData} />
          </div>
        )}

        {/* Zone Analysis View */}
        {activeView === "zone-analysis" && (
          <div className="bg-white p-5 rounded-lg shadow-md">
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
          </div>
        )}

        {/* Trends View */}
        {activeView === "trends" && (
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Consumption Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consumptionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="consumption"
                    name="Consumption (kWh)"
                    stroke={ACCENT_COLOR}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "#4E4456", stroke: "#4E4456" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}