"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DownloadIcon, 
  Search, 
  Filter, 
  ArrowUpDown 
} from "lucide-react";

interface ElectricityRecord {
  Name: string;
  Type: string;
  "Meter Account No.": string | null;
  [monthYear: string]: number | string | null; // For columns like Apr-24, May-24 etc.
}

export default function ElectricityDataTable({ initialData = [] }: { initialData: ElectricityRecord[] }) {
  const [data, setData] = useState<ElectricityRecord[]>(initialData);
  const [filteredData, setFilteredData] = useState<ElectricityRecord[]>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Update data when initialData changes
  useEffect(() => {
    setData(initialData);
    setFilteredData(initialData);
    setIsLoading(false);
  }, [initialData]);

  // Get unique types for filter dropdown
  const uniqueTypes = React.useMemo(() => {
    const types = new Set<string>();
    data.forEach(record => {
      if (record.Type) types.add(record.Type);
    });
    return ["All", ...Array.from(types)];
  }, [data]);

  // Get month columns for table headers
  const monthColumns = React.useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0])
      .filter(key => key.includes("-") && !isNaN(Number(data[0][key])))
      .sort((a, b) => {
        // Parse the month abbreviation and year
        const [monthA, yearA = ""] = a.split('-');
        const [monthB, yearB = ""] = b.split('-');
        
        // Compare years first
        if (yearA !== yearB) {
          return yearB.localeCompare(yearA); // Most recent year first
        }
        
        // Then compare months
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndexA = monthNames.indexOf(monthA);
        const monthIndexB = monthNames.indexOf(monthB);
        
        return monthIndexB - monthIndexA; // Most recent month first
      });
  }, [data]);

  // Filter and sort data
  useEffect(() => {
    let result = [...data];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(record => 
        record.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (record["Meter Account No."] && record["Meter Account No."].toString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply type filter
    if (typeFilter !== "All") {
      result = result.filter(record => record.Type === typeFilter);
    }
    
    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === null) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (bValue === null) return sortConfig.direction === 'ascending' ? 1 : -1;
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
        }
        
        // String comparison
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        return sortConfig.direction === 'ascending' 
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      });
    }
    
    setFilteredData(result);
  }, [data, searchTerm, typeFilter, sortConfig]);

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Export to CSV
  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    
    const headers = Object.keys(filteredData[0]);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle null values and ensure proper CSV formatting
          if (value === null) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'electricity_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading Electricity Data...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or meter number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 h-4 w-4" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ACCD5] focus:border-transparent"
              >
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <Button 
            onClick={exportToCSV}
            className="bg-[#4E4456] hover:bg-[#3a3341] text-white"
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('Name')}
                >
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('Type')}
                >
                  <div className="flex items-center">
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('Meter Account No.')}
                >
                  <div className="flex items-center">
                    Meter Account No.
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                {monthColumns.map(month => (
                  <TableHead 
                    key={month}
                    className="cursor-pointer text-right"
                    onClick={() => requestSort(month)}
                  >
                    <div className="flex items-center justify-end">
                      {month}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3 + monthColumns.length} className="text-center py-8">
                    No data found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{record.Name}</TableCell>
                    <TableCell>{record.Type}</TableCell>
                    <TableCell>{record["Meter Account No."] || "—"}</TableCell>
                    {monthColumns.map(month => (
                      <TableCell key={month} className="text-right">
                        {record[month] !== null ? Number(record[month]).toLocaleString() : "—"}
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
