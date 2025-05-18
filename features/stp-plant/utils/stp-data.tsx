"use client";

import { useMemo } from "react";

// Type definition for the STP data provided
export interface StpData {
  "Date:": string;
  "Number of Tankers Discharged:": number;
  "Expected Tanker Volume (m³) (20 m3)": number;
  "Direct In line Sewage (MB)": number;
  "Total Inlet Sewage Received from (MB+Tnk) -m³": number;
  "Total Treated Water Produced - m³": number;
  "Total TSE Water Output to Irrigation - m³": number;
}

// Parse the raw data string into a structured array of StpData
export function parseStpCsvData(data: string): StpData[] {
  // Split the data into lines
  const lines = data.trim().split('\n');
  
  // Get headers
  const headers = lines[0].split('\t');
  
  // Parse each data row
  return lines.slice(1).map(line => {
    const values = line.split('\t');
    const record: any = {};
    
    headers.forEach((header, index) => {
      // Clean up the value and convert numbers
      const value = values[index]?.trim();
      if (header === "Date:") {
        record[header] = value;
      } else {
        // Try to convert to number, fall back to original value if NaN
        const numValue = parseFloat(value?.replace(/,/g, '.') || '0');
        record[header] = isNaN(numValue) ? value : numValue;
      }
    });
    
    return record as StpData;
  });
}

// Aggregated monthly data
export interface MonthlyData {
  month: string;
  year: number;
  totalTankers: number;
  totalTankerVolume: number;
  totalDirectSewage: number;
  totalInletSewage: number;
  totalTreatedWater: number;
  totalTseOutput: number;
  avgEfficiency: number;
  utilizationRate: number;
}

// Function to aggregate data by month
export function aggregateByMonth(data: StpData[]): MonthlyData[] {
  const monthlyData: { [key: string]: MonthlyData } = {};
  
  // Define plant capacity
  const plantCapacity = 750; // m³/day
  
  data.forEach(record => {
    // Parse the date
    const dateParts = record["Date:"].split('/');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const year = parseInt(dateParts[2]);
    
    // Skip invalid dates
    if (isNaN(day) || isNaN(month) || isNaN(year)) return;
    
    const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
    const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
    
    // Initialize monthly record if it doesn't exist
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthName,
        year: year,
        totalTankers: 0,
        totalTankerVolume: 0,
        totalDirectSewage: 0,
        totalInletSewage: 0,
        totalTreatedWater: 0,
        totalTseOutput: 0,
        avgEfficiency: 0,
        utilizationRate: 0,
        daysInMonth: 0
      };
    }
    
    // Accumulate values
    monthlyData[monthKey].totalTankers += record["Number of Tankers Discharged:"];
    monthlyData[monthKey].totalTankerVolume += record["Expected Tanker Volume (m³) (20 m3)"];
    monthlyData[monthKey].totalDirectSewage += record["Direct In line Sewage (MB)"];
    monthlyData[monthKey].totalInletSewage += record["Total Inlet Sewage Received from (MB+Tnk) -m³"];
    monthlyData[monthKey].totalTreatedWater += record["Total Treated Water Produced - m³"];
    monthlyData[monthKey].totalTseOutput += record["Total TSE Water Output to Irrigation - m³"];
    monthlyData[monthKey].daysInMonth = (monthlyData[monthKey].daysInMonth || 0) + 1;
  });
  
  // Calculate averages and rates
  return Object.values(monthlyData).map(month => {
    const daysInMonth = month.daysInMonth || 1;
    
    // Calculate efficiency (treated water / inlet sewage)
    const efficiency = month.totalInletSewage > 0 
      ? (month.totalTreatedWater / month.totalInletSewage) * 100 
      : 0;
    
    // Calculate utilization rate (inlet sewage / total plant capacity for the month)
    const totalMonthlyCapacity = plantCapacity * daysInMonth;
    const utilizationRate = totalMonthlyCapacity > 0 
      ? (month.totalInletSewage / totalMonthlyCapacity) * 100 
      : 0;
    
    return {
      ...month,
      avgEfficiency: efficiency,
      utilizationRate: utilizationRate
    };
  }).sort((a, b) => {
    // Sort by year and month
    if (a.year !== b.year) return a.year - b.year;
    return new Date(0, parseInt(a.month) - 1).getMonth() - new Date(0, parseInt(b.month) - 1).getMonth();
  });
}

// Hook to process STP data
export function useStpData(rawData: string) {
  return useMemo(() => {
    // Parse the raw data
    const parsedData = parseStpCsvData(rawData);
    
    // Aggregate by month
    const monthlyData = aggregateByMonth(parsedData);
    
    return {
      daily: parsedData,
      monthly: monthlyData
    };
  }, [rawData]);
}
