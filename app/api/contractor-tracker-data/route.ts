import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const devFilePath = "/home/ubuntu/processed_data/contractor_tracker_data.json";
    const publicFilePath = path.join(process.cwd(), "public", "data", "contractor_tracker_data.json");

    let dataPath = "";

    if (fs.existsSync(devFilePath)) {
      dataPath = devFilePath;
    } else if (fs.existsSync(publicFilePath)) {
      dataPath = publicFilePath;
    } else {
      console.error("Contractor Tracker data file not found at:", devFilePath, "or", publicFilePath);
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }

    const jsonData = fs.readFileSync(dataPath, "utf-8");
    // The CSV had headers in the first data row, so the JSON needs cleaning.
    // The actual data starts from the second object in the array if the headers were included.
    let data = JSON.parse(jsonData);
    // Check if the first row is header-like and adjust
    if (data.length > 0 && data[0]["Unnamed: 0"] === "Contractor") {
        const headers = data[0];
        const actualData = data.slice(1).map((row: any) => {
            const newRow: { [key: string]: any } = {};
            Object.keys(headers).forEach(headerKey => {
                const newHeaderKey = headers[headerKey]?.trim().replace(/\s+/g, ".").replace(/\(|\)|\//g, "") || headerKey;
                newRow[newHeaderKey] = row[headerKey];
            });
            return newRow;
        });
        return NextResponse.json(actualData);
    } else {
        // If already processed or headers were not in data[0]
        const cleanedData = data.map((row: any) => {
            const newRow: { [key: string]: any } = {};
            Object.keys(row).forEach(key => {
                // A more generic cleaning if headers were not like 'Unnamed: 0'
                const newKey = key.trim().replace(/\s+/g, ".").replace(/\(|\)|\//g, "") || key;
                newRow[newKey] = row[key];
            });
            return newRow;
        });
         return NextResponse.json(cleanedData);
    }

  } catch (error) {
    console.error("Error reading Contractor Tracker data:", error);
    return NextResponse.json({ message: "Error fetching data", error: (error as Error).message }, { status: 500 });
  }
}

