import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    // Since we're using mock data in the main dashboard, we'll return that data here
    // In a real scenario, this would fetch from a database or file like the other endpoints
    const mockWaterData = [
      { month: "Oct", L1: 31519, L2: 39285, L3: 30881, Stage01Loss: -7766, Stage02Loss: 8404, TotalLoss: 638 },
      { month: "Nov", L1: 35290, L2: 29913, L3: 24719, Stage01Loss: 5377, Stage02Loss: 5194, TotalLoss: 10571 },
      { month: "Dec", L1: 36733, L2: 32492, L3: 24545, Stage01Loss: 4241, Stage02Loss: 7947, TotalLoss: 12188 },
      { month: "Jan", L1: 32580, L2: 35325, L3: 27898, Stage01Loss: -2745, Stage02Loss: 7427, TotalLoss: 4682 },
      { month: "Feb", L1: 44043, L2: 35811, L3: 28369, Stage01Loss: 8232, Stage02Loss: 7442, TotalLoss: 15674 },
      { month: "Mar", L1: 34915, L2: 39565, L3: 32264, Stage01Loss: -4650, Stage02Loss: 7301, TotalLoss: 2651 },
    ];

    return NextResponse.json(mockWaterData);
  } catch (error) {
    console.error("Error providing water data:", error);
    return NextResponse.json({ message: "Error fetching data", error: (error as Error).message }, { status: 500 });
  }
}