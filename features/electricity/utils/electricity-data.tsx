"use client";

import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ElectricityConsumption {
  id: number;
  meter_name: string;
  meter_type: string;
  meter_account_number: string | null;
  consumption_date: string;
  consumption_value: number;
  created_at?: string;
  updated_at?: string;
}

export interface ZoneSummary {
  id: number;
  zone_name: string;
  total_consumption: number;
  meters_count: number;
  avg_consumption: number;
  month_year: string;
  created_at?: string;
  updated_at?: string;
}

export interface MonthlyTrend {
  id: number;
  month_year: string;
  total_consumption: number;
  peak_demand: number;
  avg_temperature: number | null;
  percentage_change: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface HighConsumptionUnit {
  id: number;
  unit_name: string;
  consumption_value: number;
  percentage_of_total: number;
  month_year: string;
  created_at?: string;
  updated_at?: string;
}

export interface ElectricityDataState {
  consumption: ElectricityConsumption[];
  zoneSummary: ZoneSummary[];
  monthlyTrends: MonthlyTrend[];
  highConsumptionUnits: HighConsumptionUnit[];
  isLoading: boolean;
  error: string | null;
}

export function useElectricityData() {
  const [data, setData] = useState<ElectricityDataState>({
    consumption: [],
    zoneSummary: [],
    monthlyTrends: [],
    highConsumptionUnits: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    async function fetchElectricityData() {
      try {
        setData(prev => ({ ...prev, isLoading: true }));
        
        // Fetch consumption data
        const { data: consumptionData, error: consumptionError } = await supabase
          .from('electricity_consumption')
          .select('*')
          .order('consumption_date', { ascending: false });
          
        if (consumptionError) throw new Error(`Error fetching consumption data: ${consumptionError.message}`);
        
        // Fetch zone summary data
        const { data: zoneSummaryData, error: zoneSummaryError } = await supabase
          .from('electricity_zone_summary')
          .select('*');
          
        if (zoneSummaryError) throw new Error(`Error fetching zone summary: ${zoneSummaryError.message}`);
        
        // Fetch monthly trends data
        const { data: monthlyTrendsData, error: monthlyTrendsError } = await supabase
          .from('electricity_monthly_trends')
          .select('*')
          .order('month_year', { ascending: true });
          
        if (monthlyTrendsError) throw new Error(`Error fetching monthly trends: ${monthlyTrendsError.message}`);
        
        // Fetch high consumption units data
        const { data: highConsumptionData, error: highConsumptionError } = await supabase
          .from('electricity_highest_consumption')
          .select('*')
          .order('consumption_value', { ascending: false });
          
        if (highConsumptionError) throw new Error(`Error fetching high consumption units: ${highConsumptionError.message}`);
        
        setData({
          consumption: consumptionData || [],
          zoneSummary: zoneSummaryData || [],
          monthlyTrends: monthlyTrendsData || [],
          highConsumptionUnits: highConsumptionData || [],
          isLoading: false,
          error: null
        });
      } catch (err) {
        console.error('Failed to fetch electricity data:', err);
        setData(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: err instanceof Error ? err.message : 'Failed to fetch electricity data' 
        }));
      }
    }
    
    fetchElectricityData();
  }, []);

  return data;
}

// Process electricity data for dashboard display
export function processElectricityDataForDisplay(data: ElectricityConsumption[]) {
  if (!data.length) return [];
  
  // Group by meter and create month-based columns
  const meterMap = new Map();
  
  data.forEach(record => {
    const { meter_name, meter_type, meter_account_number, consumption_date, consumption_value } = record;
    
    // Format date to MMM-YY
    const date = new Date(consumption_date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear().toString().slice(-2)}`;
    
    if (!meterMap.has(meter_name)) {
      meterMap.set(meter_name, {
        Name: meter_name,
        Type: meter_type,
        "Meter Account No.": meter_account_number,
      });
    }
    
    // Add or update the month-year column
    const meter = meterMap.get(meter_name);
    meter[monthYear] = consumption_value;
  });
  
  return Array.from(meterMap.values());
}

import { useState, useEffect } from 'react';
