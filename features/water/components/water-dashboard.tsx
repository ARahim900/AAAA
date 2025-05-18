"use client"

import React from 'react';
import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Define the base color and generate a color palette
const BASE_COLOR = "#4E4456"
const SECONDARY_COLOR = "#8A7A94"
const ACCENT_COLOR = "#8ACCD5"
const SUCCESS_COLOR = "#50C878"
const WARNING_COLOR = "#FFB347"
const DANGER_COLOR = "#FF6B6B"
const INFO_COLOR = "#5BC0DE"
const NEUTRAL_COLOR = "#ADB5BD"

// Function to lighten a color
const lightenColor = (color: string, amount: number) => {
  const num = Number.parseInt(color.replace("#", ""), 16)
  const r = Math.min(255, ((num >> 16) & 0xff) + 255 * amount)
  const g = Math.min(255, ((num >> 8) & 0xff) + 255 * amount)
  const b = Math.min(255, (num & 0xff) + 255 * amount)
  return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)
}

// Generate gradient string for CSS
const generateGradient = (color1: string, color2: string, direction = "to right") => {
  return `linear-gradient(${direction}, ${color1}, ${color2})`
}

// Monthly water data for display
const waterData = [
  { month: "Jan", consumption: 32803, distribution: 28689, users: 25680, loss: 7123 },
  { month: "Feb", consumption: 27996, distribution: 25073, users: 21908, loss: 6088 },
  { month: "Mar", consumption: 23860, distribution: 24007, users: 19626, loss: 4234 },
  { month: "Apr", consumption: 31869, distribution: 28713, users: 23584, loss: 8285 },
  { month: "May", consumption: 30737, distribution: 28089, users: 23692, loss: 7045 },
  { month: "Jun", consumption: 41953, distribution: 34626, users: 27865, loss: 14088 },
  { month: "Jul", consumption: 35166, distribution: 34689, users: 25961, loss: 9205 },
  { month: "Aug", consumption: 35420, distribution: 32753, users: 25246, loss: 10174 },
  { month: "Sep", consumption: 41341, distribution: 30892, users: 23744, loss: 17597 },
  { month: "Oct", consumption: 31519, distribution: 39285, users: 30881, loss: 637 },
  { month: "Nov", consumption: 35290, distribution: 29913, users: 24719, loss: 10571 },
  { month: "Dec", consumption: 36733, distribution: 32492, users: 24545, loss: 12188 },
]

// Efficiency calculation
const efficiencyData = waterData.map(item => ({
  month: item.month,
  efficiency: ((item.consumption - item.loss) / item.consumption * 100).toFixed(1)
}))

// Data Filter component
interface DataFilterProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

const DataFilter = ({ label, options, value, onChange, className }: DataFilterProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label className="text-sm font-medium text-white">{label}:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
        aria-label={`Select ${label}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// Main Dashboard Component
export default function WaterDashboardFeature() {
  const [selectedMonth, setSelectedMonth] = useState("Apr")
  const [selectedZone, setSelectedZone] = useState("all")
  
  // Generate month options for filter
  const monthOptions = waterData.map((item) => ({
    value: item.month,
    label: item.month,
  }))

  // Zone options for filter
  const zoneOptions = [
    { value: "all", label: "All Zones" },
    { value: "Zone01FM", label: "Zone 01 FM" },
    { value: "Zone03A", label: "Zone 03(A)" },
    { value: "Zone03B", label: "Zone 03(B)" },
    { value: "Zone05", label: "Zone 05" },
    { value: "Zone08", label: "Zone 08" },
    { value: "ZoneVS", label: "Zone VS" },
  ]

  // Get data for the selected month
  const selectedData = waterData.find(item => item.month === selectedMonth) || waterData[waterData.length - 1]
  const efficiencyValue = ((selectedData.consumption - selectedData.loss) / selectedData.consumption * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Improved Header with solid background */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${BASE_COLOR} 0%, ${SECONDARY_COLOR} 100%)`,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-6 relative z-10">
          {/* Header Content */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Muscat Bay Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-3xl font-bold text-white">Muscat Bay Water Management</h1>
                <p className="text-purple-100 mt-1">Advanced Real-time Analytics Dashboard</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
              {/* Filters Section - Reorganized */}
              <div className="flex flex-wrap gap-3">
                <DataFilter
                  label="Month"
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  className="bg-white/10 rounded-lg px-3 py-2 text-white"
                />

                <DataFilter
                  label="Zone"
                  options={zoneOptions}
                  value={selectedZone}
                  onChange={setSelectedZone}
                  className="bg-white/10 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Time Range Slider with white text */}
          <div className="mt-2">
            <div className="w-full px-4">
              <input
                type="range"
                min={0}
                max={11}
                value={monthOptions.findIndex(m => m.value === selectedMonth)}
                onChange={(e) => setSelectedMonth(monthOptions[Number(e.target.value)].value)}
                className="w-full h-2 bg-gradient-to-r from-[#8ACCD5] to-[#8ACCD5] rounded-lg appearance-none cursor-pointer"
                aria-label="Time range slider"
              />
              <div className="flex justify-between mt-2 text-xs text-white">
                {monthOptions.filter((_, i) => i % 2 === 0).map((month, index) => (
                  <span key={index} className={selectedMonth === month.value ? "font-bold text-white bg-[#4E4456] px-2 py-1 rounded" : ""}>
                    {month.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">Total Water Supply</h3>
            <p className="text-3xl font-bold mt-2" style={{ color: BASE_COLOR }}>
              {selectedData.consumption.toLocaleString()} m³
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">End User Consumption</h3>
            <p className="text-3xl font-bold mt-2" style={{ color: BASE_COLOR }}>
              {selectedData.users.toLocaleString()} m³
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">Total Water Loss</h3>
            <p className="text-3xl font-bold mt-2" style={{ color: BASE_COLOR }}>
              {selectedData.loss.toLocaleString()} m³
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">System Efficiency</h3>
            <p className="text-3xl font-bold mt-2" style={{ color: BASE_COLOR }}>
              {efficiencyValue}%
            </p>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Water Flow Distribution - {selectedMonth}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[selectedData]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="consumption" name="Total Supply" fill={BASE_COLOR} />
                <Bar dataKey="distribution" name="Zone Distribution" fill={ACCENT_COLOR} />
                <Bar dataKey="users" name="End User Consumption" fill={SUCCESS_COLOR} />
                <Bar dataKey="loss" name="Total Loss" fill={DANGER_COLOR} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Trend Chart */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">System Efficiency Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke={ACCENT_COLOR}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2, fill: "#4E4456", stroke: "#4E4456" }}
                  name="Efficiency %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}