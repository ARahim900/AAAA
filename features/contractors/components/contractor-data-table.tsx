"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionHeader } from "@/components/ui/section-header";
import {
  DownloadIcon,
  SearchIcon,
  FilterIcon,
  ArrowUpDown,
  CalendarDaysIcon
} from "lucide-react"; // Assuming these icons are available

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
  [key: string]: any; // For cleaned keys
}

interface ContractorDataTableProps {
  initialData: ContractorRecord[];
}

export default function ContractorDataTable({ initialData }: ContractorDataTableProps) {
  const [data, setData] = useState<ContractorRecord[]>(initialData);
  const [filteredData, setFilteredData] = useState<ContractorRecord[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [contractTypeFilter, setContractTypeFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ContractorRecord | string;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    setData(initialData);
    setFilteredData(initialData);
  }, [initialData]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set<string>();
    data.forEach(record => record.Status && statuses.add(record.Status));
    return ["All", ...Array.from(statuses).sort()];
  }, [data]);

  const uniqueContractTypes = useMemo(() => {
    const types = new Set<string>();
    data.forEach(record => record.ContractType && types.add(record.ContractType));
    return ["All", ...Array.from(types).sort()];
  }, [data]);

  useEffect(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter(record =>
        record.Contractor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ServiceProvided?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.Note?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(record => record.Status === statusFilter);
    }

    if (contractTypeFilter !== "All") {
      result = result.filter(record => record.ContractType === contractTypeFilter);
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return sortConfig.direction === "ascending" ? -1 : 1;
        if (bValue === null || bValue === undefined) return sortConfig.direction === "ascending" ? 1 : -1;

        if (sortConfig.key === "StartDate" || sortConfig.key === "EndDate") {
            const dateA = aValue ? new Date(String(aValue).split("/").reverse().join("-")).getTime() : 0;
            const dateB = bValue ? new Date(String(bValue).split("/").reverse().join("-")).getTime() : 0;
            return sortConfig.direction === "ascending" ? dateA - dateB : dateB - dateA;
        }
        
        // Fixed OMR values parsing for sorting
        if (sortConfig.key === "ContractOMRMonth" || sortConfig.key === "ContractTotalOMRYear") {
            const numA = parseFloat(String(aValue).replace(/[^\d.-]/g, ""));
            const numB = parseFloat(String(bValue).replace(/[^\d.-]/g, ""));
            if (!isNaN(numA) && !isNaN(numB)) {
                return sortConfig.direction === "ascending" ? numA - numB : numB - numA;
            }
        }

        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        return sortConfig.direction === "ascending"
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      });
    }
    setFilteredData(result);
  }, [data, searchTerm, statusFilter, contractTypeFilter, sortConfig]);

  const requestSort = (key: keyof ContractorRecord | string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]) as (keyof ContractorRecord | string)[];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(row =>
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return "";
          const stringValue = String(value);
          return stringValue.includes(",") ? `"${stringValue}"` : stringValue;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "contractor_tracker_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columnConfig: { key: keyof ContractorRecord | string; label: string; className?: string }[] = [
    { key: "Contractor", label: "Contractor" },
    { key: "ServiceProvided", label: "Service Provided", className: "min-w-[200px]" },
    { key: "Status", label: "Status" },
    { key: "ContractType", label: "Contract Type" },
    { key: "StartDate", label: "Start Date" },
    { key: "EndDate", label: "End Date" },
    { key: "ContractOMRMonth", label: "Contract (OMR)/Month", className: "text-right" },
    { key: "ContractTotalOMRYear", label: "Total (OMR)/Year", className: "text-right" },
    { key: "Note", label: "Note", className: "min-w-[250px]" },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <SectionHeader
          title="Contractor Agreements"
          description="Detailed list of all contractor agreements and their statuses."
        />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full md:w-auto items-center">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search contractor, service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-56"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <FilterIcon className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={contractTypeFilter} onValueChange={setContractTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <FilterIcon className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                {uniqueContractTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={exportToCSV}
            className="bg-[#4E4456] hover:bg-[#3a3341] text-white mt-4 md:mt-0"
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columnConfig.map(col => (
                  <TableHead
                    key={col.key}
                    className={`cursor-pointer whitespace-nowrap ${col.className || ""}`}
                    onClick={() => requestSort(col.key)}
                  >
                    <div className={`flex items-center ${col.className?.includes("text-right") ? "justify-end" : ""}`}>
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
                  <TableCell colSpan={columnConfig.length} className="text-center py-8">
                    No contracts found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((record, index) => (
                  <TableRow key={index}>
                    {columnConfig.map(col => (
                      <TableCell key={col.key} className={`${col.className || ""} ${
                        col.key === "Status" && record.Status?.toLowerCase() === "active" ? "text-green-600 font-medium" :
                        col.key === "Status" && record.Status?.toLowerCase().includes("expire") ? "text-red-600 font-medium" : ""
                      }`}>
                        {String(record[col.key] === null || record[col.key] === undefined || String(record[col.key]).toLowerCase() === "nan" ? "—" : record[col.key])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredData.length} of {data.length} contracts
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
