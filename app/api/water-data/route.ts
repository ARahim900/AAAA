import { NextRequest, NextResponse } from 'next/server';

// Sample water data
const waterData = [
  { month: "Jan-24", L1: 32803, L2: 28689, L3: 25680, Stage01Loss: 4114, Stage02Loss: 3009, TotalLoss: 7123 },
  { month: "Feb-24", L1: 27996, L2: 25073, L3: 21908, Stage01Loss: 2923, Stage02Loss: 3165, TotalLoss: 6088 },
  { month: "Mar-24", L1: 23860, L2: 24007, L3: 19626, Stage01Loss: -147, Stage02Loss: 4381, TotalLoss: 4234 },
  { month: "Apr-24", L1: 31869, L2: 28713, L3: 23584, Stage01Loss: 3156, Stage02Loss: 5129, TotalLoss: 8285 },
  { month: "May-24", L1: 30737, L2: 28089, L3: 23692, Stage01Loss: 2648, Stage02Loss: 4397, TotalLoss: 7045 },
  { month: "Jun-24", L1: 41953, L2: 34626, L3: 27865, Stage01Loss: 7327, Stage02Loss: 6761, TotalLoss: 14088 },
  { month: "Jul-24", L1: 35166, L2: 34689, L3: 25961, Stage01Loss: 477, Stage02Loss: 8728, TotalLoss: 9205 },
  { month: "Aug-24", L1: 35420, L2: 32753, L3: 25246, Stage01Loss: 2667, Stage02Loss: 7507, TotalLoss: 10174 },
  { month: "Sep-24", L1: 41341, L2: 30892, L3: 23744, Stage01Loss: 10449, Stage02Loss: 7148, TotalLoss: 17597 },
  { month: "Oct-24", L1: 31519, L2: 39285, L3: 30881, Stage01Loss: -7766, Stage02Loss: 8404, TotalLoss: 637 },
  { month: "Nov-24", L1: 35290, L2: 29913, L3: 24719, Stage01Loss: 5377, Stage02Loss: 5194, TotalLoss: 10571 },
  { month: "Dec-24", L1: 36733, L2: 32492, L3: 24545, Stage01Loss: 4241, Stage02Loss: 7947, TotalLoss: 12188 },
  { month: "Jan-25", L1: 32580, L2: 35325, L3: 27898, Stage01Loss: -2745, Stage02Loss: 7427, TotalLoss: 4682 },
  { month: "Feb-25", L1: 44043, L2: 35811, L3: 28369, Stage01Loss: 8232, Stage02Loss: 7442, TotalLoss: 15674 },
  { month: "Mar-25", L1: 34915, L2: 39565, L3: 32264, Stage01Loss: -4650, Stage02Loss: 7301, TotalLoss: 2651 },
  { month: "Apr-25", L1: 46039, L2: 45868, L3: 37192, Stage01Loss: 171, Stage02Loss: 8676, TotalLoss: 8847 },
];

export async function GET(request: NextRequest) {
  try {
    // Return data with 200 OK status
    return NextResponse.json(waterData, { status: 200 });
  } catch (error) {
    // Handle unexpected errors
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
