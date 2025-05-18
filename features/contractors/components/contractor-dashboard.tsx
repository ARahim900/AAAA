"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import ContractorDataTable from "./contractor-data-table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

// Color Palette
const BASE_COLOR = "#4E4456";
const SECONDARY_COLOR = "#694E5F";
const ACCENT_COLOR = "#8ACCD5";
const INFO_COLOR = "#5BC0DE";
const SUCCESS_COLOR = "#50C878"; // Active status
const WARNING_COLOR = "#FFB347"; // Nearing Expiry
const DANGER_COLOR = "#FF6B6B"; // Expired
const CHART_COLORS = [SUCCESS_COLOR, DANGER_COLOR, WARNING_COLOR, INFO_COLOR, BASE_COLOR, ACCENT_COLOR];

interface ContractorRecord {
  Contractor: string;
  ServiceProvided: string;
  Status: string;
  ContractType: string;
  StartDate: string | null;
  EndDate: string | null;
  ContractOMRMonth: string | null;
  ContractTotalOMRYear: string | null;
  Note: string | null;
  [key: string]: any;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-[#4E4456] shadow-md rounded-md">
        <p className="font-medium mb-1 text-[#4E4456]">{label || payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color || entry.payload.fill }} className="text-sm">
            {entry.name}: {Number(entry.value).toLocaleString()} {entry.payload.unit || ""}
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

export default function ContractorTrackerDashboard() {
  const [contractorData, setContractorData] = useState<ContractorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [filter, setFilter] = useState("all"); // all, active, expired, upcoming
  const isMobile = useMobile();

  useEffect(() => {
    fetch("/api/contractor-tracker-data")
      .then((res) => res.json())
      .then((data: ContractorRecord[]) => {
        setContractorData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching Contractor Tracker data:", error);
        setIsLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    if (filter === "all") return contractorData;
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const next60Days = new Date();
    next60Days.setDate(today.getDate() + 60);
    
    return contractorData.filter(contract => {
      const status = contract.Status?.toLowerCase();
      let endDate: Date | null = null;
      
      if (contract.EndDate) {
        const parts = contract.EndDate.split("/"); // Assuming DD/MM/YYYY
        if (parts.length === 3) {
          endDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        }
      }
      
      if (filter === "active") {
        return status === "active";
      } else if (filter === "expired") {
        return (endDate && endDate < today) || status?.includes("expire");
      } else if (filter === "upcoming") {
        return status === "active" && endDate && endDate >= today && endDate <= next60Days;
      }
      
      return true;
    });
  }, [contractorData, filter]);

  const summaryMetrics = useMemo(() => {
    if (contractorData.length === 0) {
      return {
        totalContracts: 0,
        activeContracts: 0,
        expiredContracts: 0,
        upcomingExpiries: 0,
      };
    }
    const today = new Date();
    today.setHours(0,0,0,0); // Normalize today to start of day
    const next60Days = new Date();
    next60Days.setDate(today.getDate() + 60);

    let active = 0;
    let expiredCount = 0;
    let upcoming = 0;

    contractorData.forEach(contract => {
      const status = contract.Status?.toLowerCase();
      let endDate: Date | null = null;
      if (contract.EndDate) {
        const parts = contract.EndDate.split("/"); // Assuming DD/MM/YYYY
        if (parts.length === 3) {
          endDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        }
      }

      if (status === "active") {
        active++;
        if (endDate && endDate >= today && endDate <= next60Days) {
          upcoming++;
        }
      } 
      
      if (endDate && endDate < today) {
        expiredCount++;
      } else if (status?.includes("expire") && (!endDate || endDate >= today )) {
        // If status says expired but date is not in past, count as expired by status
        expiredCount++;
      }
    });

    return {
      totalContracts: contractorData.length,
      activeContracts: active,
      expiredContracts: expiredCount,
      upcomingExpiries: upcoming,
    };
  }, [contractorData]);

  const contractStatusDistribution = useMemo(() => {
    if (contractorData.length === 0) return [];
    const statusCounts: { [key: string]: number } = {};
    contractorData.forEach(contract => {
      const status = contract.Status || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [contractorData]);

  const expiringContractsTimeline = useMemo(() => {
    if (contractorData.length === 0) return [];
    const today = new Date();
    today.setHours(0,0,0,0);
    return contractorData
      .filter(contract => {
        if (!contract.EndDate) return false;
        const parts = contract.EndDate.split("/");
        if (parts.length !== 3) return false;
        const endDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        return endDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.EndDate!.split("/").reverse().join("-")).getTime();
        const dateB = new Date(b.EndDate!.split("/").reverse().join("-")).getTime();
        return dateA - dateB;
      })
      .slice(0, 10); // Show upcoming 10 for timeline view
  }, [contractorData]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading Contractor Data...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section styled to match water dashboard */}
      <div className="bg-[#4E4456] py-4">
        <div className="container mx-auto px-6">
          <div className="mb-4 flex items-center">
            <img src="/logo.png" alt="Muscat Bay Logo" className="h-12 w-auto mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-white">Muscat Bay Contractor Tracker</h1>
              <p className="text-gray-300 text-sm">Manage and Monitor Contractor Agreements</p>
            </div>
          </div>

          {/* Filter selector in the header */}
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center">
              <span className="text-white mr-2">Status:</span>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white/10 text-white border border-white/20 rounded px-2 py-1"
              >
                <option value="all">All Contracts</option>
                <option value="active">Active Only</option>
                <option value="expired">Expired</option>
                <option value="upcoming">Expiring Soon (60 Days)</option>
              </select>
            </div>
          </div>
          
          {/* Status filter tabs */}
          <div className="flex overflow-x-auto py-2 bg-[#3d3545] rounded-t-lg">
            {["All", "Active", "Expired", "Upcoming Expiries"].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status.toLowerCase().replace(" expiries", ""))}
                className={`px-4 py-2 mx-1 whitespace-nowrap rounded 
                  ${filter === status.toLowerCase().replace(" expiries", "") 
                    ? 'bg-[#8ACCD5] text-[#4E4456]' 
                    : 'bg-transparent text-gray-300 hover:bg-white/10'}`}
              >
                {status}
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
              {["Overview", "All Contracts", "Analytics"].map(tab => (
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
                title="Total Contracts"
                value={summaryMetrics.totalContracts}
                icon={<span className="text-[#4E4456]">📑</span>}
              />
              <KPICard 
                title="Active Contracts"
                value={summaryMetrics.activeContracts}
                icon={<span className="text-green-500">✓</span>}
              />
              <KPICard 
                title="Expired Contracts"
                value={summaryMetrics.expiredContracts}
                icon={<span className="text-red-500">⚠</span>}
              />
              <KPICard 
                title="Upcoming Expiries (60 Days)"
                value={summaryMetrics.upcomingExpiries}
                icon={<span className="text-amber-500">⏰</span>}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Contract Status Distribution</h3>
                  <p className="text-sm text-gray-500 mb-4">Breakdown of contracts by their current status.</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={contractStatusDistribution} 
                          dataKey="value" 
                          nameKey="name" 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={isMobile ? 70 : 90} 
                          labelLine={false} 
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {contractStatusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Expiring Contracts Timeline (Next 10)</h3>
                  <p className="text-sm text-gray-500 mb-4">Upcoming contract end dates.</p>
                  <div className="h-80 overflow-y-auto">
                    {expiringContractsTimeline.length > 0 ? (
                      <ul className="space-y-3">
                        {expiringContractsTimeline.map((contract, index) => (
                          <li key={index} className="p-3 bg-gray-100 rounded-md shadow-sm">
                            <div className="font-medium text-sm text-[#4E4456]">{contract.Contractor}</div>
                            <div className="text-xs text-gray-600">Service: {contract.ServiceProvided}</div>
                            <div className="text-xs text-red-500 font-semibold">Expires: {contract.EndDate}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-center pt-10">No contracts expiring soon or data unavailable.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* All Contracts tab content */}
        {activeTab === "all-contracts" && (
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-1">All Contractor Agreements</h3>
              <p className="text-sm text-gray-500 mb-4">Detailed list with search, sort, and filter options</p>
              <ContractorDataTable initialData={filteredData} />
            </CardContent>
          </Card>
        )}
        
        {/* Analytics tab content */}
        {activeTab === "analytics" && (
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-1">Contract Analytics</h3>
              <p className="text-gray-600 mt-4">Further contract analytics could be developed based on specific requirements. For example:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Analysis of contract values (OMR/Month, OMR/Year) by contract type or service.</li>
                <li>Distribution of contract durations.</li>
                <li>Trends in new contracts or renewals over time.</li>
              </ul>
              <p className="text-gray-600 mt-4">This section can be expanded when more detailed financial data or specific analytical goals are provided.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
