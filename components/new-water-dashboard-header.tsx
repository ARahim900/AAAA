"use client"

import React from 'react';

const NewWaterDashboardHeader = () => {
  // Define the base color and generate a color palette
  const BASE_COLOR = "#4E4456";
  const SECONDARY_COLOR = "#8A7A94";
  const ACCENT_COLOR = "#8ACCD5";
  
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
                <div className="bg-white/10 rounded-lg px-3 py-2 text-white flex items-center space-x-2">
                  <label className="text-sm font-medium text-white">Month:</label>
                  <select className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-1 text-sm">
                    <option>Apr-25</option>
                    {/* Add other months here */}
                  </select>
                </div>

                <div className="bg-white/10 rounded-lg px-3 py-2 text-white flex items-center space-x-2">
                  <label className="text-sm font-medium text-white">Zone:</label>
                  <select className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-1 text-sm">
                    <option>All Zones</option>
                    {/* Add other zones here */}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Time Range Slider with white text */}
          <div className="mt-2">
            <div className="w-full px-4">
              <input
                type="range"
                min={0}
                max={15}
                value={15}
                className="w-full h-2 bg-gradient-to-r from-[#8ACCD5] to-[#8ACCD5] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-xs text-white">
                <span>Jan-24</span>
                <span>Mar-24</span>
                <span>Jun-24</span>
                <span>Sep-24</span>
                <span>Dec-24</span>
                <span className="font-bold text-white bg-[#4E4456] px-2 py-1 rounded">Apr-25</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your dashboard would go here */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">New Header Example</h2>
          <p className="text-gray-600">
            This is a standalone example of the new header design with:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-600">
            <li>Main Dashboard button removed</li>
            <li>Other Utilities dropdown button removed</li>
            <li>Enable Animations button removed</li>
            <li>Clean, organized filter layout</li>
            <li>Gradient background for better visual appeal</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewWaterDashboardHeader;