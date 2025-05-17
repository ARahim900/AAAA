import { NextRequest, NextResponse } from 'next/server';

// Sample electricity data
const electricityData = [
  { 
    "Building": "Main Tower", 
    "Meter ID": "ELEC-001", 
    "Oct-24": 18500, 
    "Nov-24": 19200, 
    "Dec-24": 20100, 
    "Jan-25": 21000, 
    "Feb-25": 20450, 
    "Mar-25": 21200, 
    "Apr-25": 22800 
  },
  { 
    "Building": "Residence A", 
    "Meter ID": "ELEC-002", 
    "Oct-24": 12800, 
    "Nov-24": 13100, 
    "Dec-24": 14200, 
    "Jan-25": 15100, 
    "Feb-25": 14800, 
    "Mar-25": 15300, 
    "Apr-25": 16500 
  },
  { 
    "Building": "Residence B", 
    "Meter ID": "ELEC-003", 
    "Oct-24": 11500, 
    "Nov-24": 12000, 
    "Dec-24": 12800, 
    "Jan-25": 13500, 
    "Feb-25": 13200, 
    "Mar-25": 13800, 
    "Apr-25": 14900 
  },
  { 
    "Building": "Commercial Block", 
    "Meter ID": "ELEC-004", 
    "Oct-24": 22400, 
    "Nov-24": 23100, 
    "Dec-24": 24300, 
    "Jan-25": 25500, 
    "Feb-25": 24900, 
    "Mar-25": 25800, 
    "Apr-25": 27200 
  },
  { 
    "Building": "Amenities Center", 
    "Meter ID": "ELEC-005", 
    "Oct-24": 9800, 
    "Nov-24": 10200, 
    "Dec-24": 10900, 
    "Jan-25": 11800, 
    "Feb-25": 11400, 
    "Mar-25": 11900, 
    "Apr-25": 12800 
  }
];

export async function GET(request: NextRequest) {
  try {
    // Return data with 200 OK status
    return NextResponse.json(electricityData, { status: 200 });
  } catch (error) {
    // Handle unexpected errors
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
