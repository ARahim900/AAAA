"use client"

import { useMemo } from "react"
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMobile } from "@/hooks/use-mobile"

// Define base color palette
const BASE_COLOR = "#4E4456"
const SECONDARY_COLOR = "#8A7A94"
const ACCENT_COLOR = "#8ACCD5"
const SUCCESS_COLOR = "#50C878"
const WARNING_COLOR = "#FFB347"
const DANGER_COLOR = "#FF6B6B"
const INFO_COLOR = "#5BC0DE"
const NEUTRAL_COLOR = "#ADB5BD"

// Chart color presets
const COLOR_PRESETS = {
  default: [BASE_COLOR, SECONDARY_COLOR, ACCENT_COLOR, NEUTRAL_COLOR],
  success: [SUCCESS_COLOR, ACCENT_COLOR, SECONDARY_COLOR, NEUTRAL_COLOR],
  warning: [WARNING_COLOR, DANGER_COLOR, SECONDARY_COLOR, NEUTRAL_COLOR],
  danger: [DANGER_COLOR, WARNING_COLOR, SECONDARY_COLOR, NEUTRAL_COLOR],
  info: [INFO_COLOR, ACCENT_COLOR, SECONDARY_COLOR, NEUTRAL_COLOR],
}

type ChartType = "line" | "bar" | "pie" | "donut"
type ColorPreset = "default" | "success" | "warning" | "danger" | "info" | "custom"

interface ChartProps {
  title?: string
  description?: string
  data: any[]
  type: ChartType
  height?: number
  width?: string
  dataKeys: string[]
  xAxisKey?: string
  colorPreset?: ColorPreset
  customColors?: string[]
  loading?: boolean
  showGrid?: boolean
  showLegend?: boolean
  aspectRatio?: number
  legendPosition?: "top" | "right" | "bottom" | "left"
}

export function Chart({
  title,
  description,
  data = [],
  type = "line",
  height = 300,
  width = "100%",
  dataKeys = [],
  xAxisKey = "name",
  colorPreset = "default",
  customColors,
  loading = false,
  showGrid = true,
  showLegend = true,
  aspectRatio = 2,
  legendPosition = "bottom",
}: ChartProps) {
  const isMobile = useMobile()
  
  // Determine colors
  const colors = useMemo(() => {
    if (colorPreset === "custom" && customColors && customColors.length > 0) {
      return customColors
    }
    return COLOR_PRESETS[colorPreset] || COLOR_PRESETS.default
  }, [colorPreset, customColors])

  // Calculate adjusted height for mobile
  const adjustedHeight = useMemo(() => {
    if (isMobile) {
      return Math.min(height, 220) // Cap height on mobile
    }
    return height
  }, [height, isMobile])

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: adjustedHeight }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4E4456]"></div>
      </div>
    )
  }

  // Render chart based on type
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width={width} height={adjustedHeight}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />}
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend layout="horizontal" verticalAlign={legendPosition} />}
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case "bar":
        return (
          <ResponsiveContainer width={width} height={adjustedHeight}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />}
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend layout="horizontal" verticalAlign={legendPosition} />}
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case "pie":
      case "donut":
        const pieData = dataKeys.length > 1
          ? data
          : data.map((item) => ({
              name: item[xAxisKey],
              value: item[dataKeys[0]],
            }))

        const innerRadius = type === "donut" ? "60%" : 0

        return (
          <ResponsiveContainer width={width} height={adjustedHeight}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={isMobile ? 80 : 100}
                innerRadius={innerRadius}
                fill={colors[0]}
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              {showLegend && <Legend layout="horizontal" verticalAlign={legendPosition} />}
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return <div>Unsupported chart type</div>
    }
  }

  // Render with or without card wrapper
  if (title || description) {
    return (
      <Card>
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{renderChart()}</CardContent>
      </Card>
    )
  }

  return renderChart()
}
