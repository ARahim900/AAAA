"use client";

import { useMemo, useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definition for Supabase STP Daily Records
export interface StpData {
  id: number;
  date: string;
  num_tankers_discharged: number;
  expected_tanker_volume: number;
  direct_inline_sewage: number;
  total_inlet_sewage: number;
  total_treated_water: number;
  total_tse_water_output: number;
  created_at?: string;
  updated_at?: string;
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
  daysInMonth: number;
}

// Function to aggregate data by month
export function aggregateByMonth(data: StpData[]): MonthlyData[] {
  const monthlyData: { [key: string]: MonthlyData } = {};
  
  // Define plant capacity
  const plantCapacity = 750; // m³/day
  
  data.forEach(record => {
    // Parse the date
    const date = new Date(record.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
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
    monthlyData[monthKey].totalTankers += record.num_tankers_discharged;
    monthlyData[monthKey].totalTankerVolume += record.expected_tanker_volume;
    monthlyData[monthKey].totalDirectSewage += record.direct_inline_sewage;
    monthlyData[monthKey].totalInletSewage += record.total_inlet_sewage;
    monthlyData[monthKey].totalTreatedWater += record.total_treated_water;
    monthlyData[monthKey].totalTseOutput += record.total_tse_water_output;
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
    return new Date(0, new Date(`${a.month} 1, 2000`).getMonth()).getMonth() - 
           new Date(0, new Date(`${b.month} 1, 2000`).getMonth()).getMonth();
  });
}

// Hook to fetch and process STP data from Supabase
export function useStpData() {
  const [stpData, setStpData] = useState<StpData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStpData() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('stp_daily_records')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) {
          throw new Error(`Error fetching STP data: ${error.message}`);
        }
        
        setStpData(data || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch STP data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch STP data");
        setIsLoading(false);
      }
    }
    
    fetchStpData();
  }, []);

  const monthly = useMemo(() => {
    return aggregateByMonth(stpData);
  }, [stpData]);

  return {
    daily: stpData,
    monthly,
    isLoading,
    error
  };
}
