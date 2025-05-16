import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "electricity_data.json");
    // In a real scenario, data might be in /home/ubuntu/processed_data/electricity_data.json
    // For Next.js public serving, it's better to place it in the public directory during the build or development setup.
    // For now, let's assume we've copied it there or will adjust the path.
    // We'll create a temporary solution to read from the processed_data directory for now.
    // This is NOT ideal for production Next.js but will work for this development context.

    const devFilePath = "/home/ubuntu/processed_data/electricity_data.json";

    if (fs.existsSync(devFilePath)) {
      const jsonData = fs.readFileSync(devFilePath, "utf-8");
      const data = JSON.parse(jsonData);
      return NextResponse.json(data);
    } else {
        // Fallback or error if the primary path also doesn't exist
        const publicFilePath = path.join(process.cwd(), "public", "data", "electricity_data.json");
        if (fs.existsSync(publicFilePath)) {
            const jsonData = fs.readFileSync(publicFilePath, "utf-8");
            const data = JSON.parse(jsonData);
            return NextResponse.json(data);
        } else {
            console.error("Electricity data file not found at:", devFilePath, "or", publicFilePath);
            return NextResponse.json({ message: "Data not found" }, { status: 404 });
        }
    }
  } catch (error) {
    console.error("Error reading electricity data:", error);
    return NextResponse.json({ message: "Error fetching data", error: (error as Error).message }, { status: 500 });
  }
}

