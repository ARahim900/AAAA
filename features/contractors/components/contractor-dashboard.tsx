"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import ContractorDataTable from "./contractor-data-table"; // Ensure this is correctly imported
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

export default function ContractorTrackerDashboard() {
  const [contractorData, setContractorData] = useState<ContractorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
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
                <h1 className="text-3xl font-bold text-white">Muscat Bay Contractor Tracker</h1>
                <p className="text-purple-100 mt-1">Manage and Monitor Contractor Agreements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex overflow-x-auto scrollbar-hide h-auto border-b border-gray-200">
            {["Overview", "All Contracts", "Analytics"].map(tabName => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard 
                title="Total Contracts" 
                value={summaryMetrics.totalContracts.toString()} 
                unit="" 
                mainValue={summaryMetrics.totalContracts}
                mainValueUnit=""
              />
              <DashboardCard 
                title="Active Contracts" 
                value={summaryMetrics.activeContracts.toString()} 
                unit="" 
                mainValue={summaryMetrics.activeContracts}
                mainValueUnit=""
              />
              <DashboardCard 
                title="Expired Contracts" 
                value={summaryMetrics.expiredContracts.toString()} 
                unit="" 
                mainValue={summaryMetrics.expiredContracts}
                mainValueUnit=""
              />
              <DashboardCard 
                title="Upcoming Expiries (60 Days)" 
                value={summaryMetrics.upcomingExpiries.toString()} 
                unit="" 
                mainValue={summaryMetrics.upcomingExpiries}
                mainValueUnit=""
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <SectionHeader title="Contract Status Distribution" description="Breakdown of contracts by their current status." />
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={contractStatusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={isMobile ? 70 : 90} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
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

                <Card>
                    <CardContent className="p-6">
                        <SectionHeader title="Expiring Contracts Timeline (Next 10)" description="Upcoming contract end dates." />
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

          </TabsContent>

          <TabsContent value="all-contracts" className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-6">
                <SectionHeader title="All Contractor Agreements" description="Detailed list with search, sort, and filter options" />
                <ContractorDataTable initialData={contractorData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6 mt-6">
             <Card>
                <CardContent className="p-6">
                    <SectionHeader title="Contract Analytics" />
                    <p className="text-gray-600 mt-4">Further contract analytics could be developed based on specific requirements. For example:</p>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                        <li>Analysis of contract values (OMR/Month, OMR/Year) by contract type or service.</li>
                        <li>Distribution of contract durations.</li>
                        <li>Trends in new contracts or renewals over time.</li>
                    </ul>
                    <p className="text-gray-600 mt-4">This section can be expanded when more detailed financial data or specific analytical goals are provided.</p>
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
