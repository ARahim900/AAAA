import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    // Path for development environment where processed_data is outside public
    const devFilePath = "/home/ubuntu/processed_data/stp_plant_data.json";
    // Path for production/deployment if data is moved to public/data
    const publicFilePath = path.join(process.cwd(), "public", "data", "stp_plant_data.json");

    let dataPath = "";

    if (fs.existsSync(devFilePath)) {
      dataPath = devFilePath;
    } else if (fs.existsSync(publicFilePath)) {
      dataPath = publicFilePath;
    } else {
      console.error("STP Plant data file not found at:", devFilePath, "or", publicFilePath);
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }

    const jsonData = fs.readFileSync(dataPath, "utf-8");
    const data = JSON.parse(jsonData);
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error reading STP Plant data:", error);
    return NextResponse.json({ message: "Error fetching data", error: (error as Error).message }, { status: 500 });
  }
}

