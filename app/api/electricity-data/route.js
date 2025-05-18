import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    // Fetch consumption data
    const { data: consumptionData, error: consumptionError } = await supabase
      .from('electricity_consumption')
      .select('*')
      .order('consumption_date', { ascending: false });
      
    if (consumptionError) {
      return NextResponse.json({ error: consumptionError.message }, { status: 500 });
    }

    // Process the data for display
    const processedData = processElectricityDataForDisplay(consumptionData || []);
    
    return NextResponse.json(processedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch electricity data' }, { status: 500 });
  }
}

// Process electricity data for dashboard display
function processElectricityDataForDisplay(data) {
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
