"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionHeader } from "@/components/ui/section-header";
import {
  DownloadIcon,
  SearchIcon,
  FilterIcon, // Assuming a generic filter icon
  ArrowUpDown,
  CalendarIcon // For date filtering
} from "lucide-react"; // Or your icon library

interface StpRecord {
  "Date:": string;
  "Number of Tankers Discharged:": number;
  "Expected Tanker Volume (m³³) (20 m3)": number;
  "Direct In line Sewage (MB)": number;
  "Total Inlet Sewage Received from (MB+Tnk) -m³": number;
  "Total Treated Water Produced - m³": number;
  "Total TSE Water Output to Irrigation - m³": number;
}

interface StpPlantDataTableProps {
  initialData: StpRecord[];
}

export default function StpPlantDataTable({ initialData }: StpPlantDataTableProps) {
  const [data, setData] = useState<StpRecord[]>(initialData);
  const [filteredData, setFilteredData] = useState<StpRecord[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StpRecord;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    setData(initialData.sort((a,b) => new Date(b["Date:"]).getTime() - new Date(a["Date:"]).getTime())); // Sort by date descending initially
  }, [initialData]);

  useEffect(() => {
    let result = [...data];

    // Apply search (currently not very useful for STP data as it's mostly numeric/dates)
    // if (searchTerm) {
    //   result = result.filter(record => 
    //     Object.values(record).some(val => 
    //       String(val).toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    //   );
    // }

    // Apply date filter
    if (dateFilter.start && dateFilter.end) {
      const startDate = new Date(dateFilter.start);
      const endDate = new Date(dateFilter.end);
      result = result.filter(record => {
        const recordDate = new Date(record["Date:"]);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === "Date:") {
            return sortConfig.direction === "ascending" 
                ? new Date(aValue).getTime() - new Date(bValue).getTime() 
                : new Date(bValue).getTime() - new Date(aValue).getTime();
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "ascending" ? aValue - bValue : bValue - aValue;
        }
        
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        return sortConfig.direction === "ascending"
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      });
    }
    setFilteredData(result);
  }, [data, searchTerm, dateFilter, sortConfig]);

  const requestSort = (key: keyof StpRecord) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]) as (keyof StpRecord)[];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(row =>
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return "";
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "stp_plant_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const columnHeaders: { key: keyof StpRecord; label: string; isNumeric?: boolean }[] = [
    { key: "Date:", label: "Date" },
    { key: "Number of Tankers Discharged:", label: "Tankers Discharged", isNumeric: true },
    { key: "Expected Tanker Volume (m³³) (20 m3)", label: "Tanker Volume (m³)", isNumeric: true },
    { key: "Direct In line Sewage (MB)", label: "Direct Sewage (m³)", isNumeric: true },
    { key: "Total Inlet Sewage Received from (MB+Tnk) -m³", label: "Total Inlet (m³)", isNumeric: true },
    { key: "Total Treated Water Produced - m³", label: "Treated Water (m³)", isNumeric: true },
    { key: "Total TSE Water Output to Irrigation - m³", label: "TSE Output (m³)", isNumeric: true },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <SectionHeader
          title="STP Plant Data Log"
          description="Detailed daily records of STP operations"
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
                <CalendarIcon className="text-gray-400 h-4 w-4" />
                <Input 
                    type="date" 
                    value={dateFilter.start} 
                    onChange={(e) => setDateFilter(prev => ({...prev, start: e.target.value}))} 
                    className="border-gray-300" 
                    aria-label="Start Date"
                />
                <span className="text-gray-500">to</span>
                <Input 
                    type="date" 
                    value={dateFilter.end} 
                    onChange={(e) => setDateFilter(prev => ({...prev, end: e.target.value}))} 
                    className="border-gray-300" 
                    aria-label="End Date"
                />
            </div>
          </div>

          <Button
            onClick={exportToCSV}
            className="bg-[${BASE_COLOR}] hover:bg-[#3a3341] text-white"
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columnHeaders.map(col => (
                  <TableHead
                    key={col.key}
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => requestSort(col.key)}
                  >
                    <div className={`flex items-center ${col.isNumeric ? 'justify-end' : ''}`}>
                      {col.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columnHeaders.length} className="text-center py-8">
                    No data found for the selected criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((record, index) => (
                  <TableRow key={index}>
                    {columnHeaders.map(col => (
                       <TableCell key={col.key} className={col.isNumeric ? "text-right" : ""}>
                        {col.key === "Date:" 
                          ? new Date(record[col.key]).toLocaleDateString("en-GB") 
                          : (record[col.key] !== null && record[col.key] !== undefined 
                              ? Number(record[col.key]).toLocaleString() 
                              : "—")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredData.length} of {data.length} records
        </div>
      </CardContent>
    </Card>
  );
}

