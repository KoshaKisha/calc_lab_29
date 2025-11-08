"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"
import { MaxwellCalculator } from "@/lib/maxwell-calculator"
import { Card } from "@/components/ui/card"

interface DistributionChartProps {
  T: number
  M: number
}

export function DistributionChart({ T, M }: DistributionChartProps) {
  const calc = new MaxwellCalculator()
  const data = calc.getDistributionData(T, M, 100)
  const { vProbable, vAverage, vRms } = calc.characteristicSpeeds(T, M)

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-lg">
      <h3 className="text-xl font-bold text-slate-50 mb-4">Распределение Максвелла f(v)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis
            dataKey="v"
            type="number"
            label={{ value: "Скорость (м/с)", position: "insideBottomRight", offset: -5, fill: "#cbd5e1" }}
            stroke="#94a3b8"
          />
          <YAxis label={{ value: "f(v)", angle: -90, position: "insideLeft", fill: "#cbd5e1" }} stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#e2e8f0" }}
            formatter={(value) => {
              if (typeof value === "number") return value.toExponential(2)
              return value
            }}
          />
          <Legend wrapperStyle={{ color: "#cbd5e1" }} />

          <ReferenceLine
            x={vProbable}
            stroke="#ef4444"
            strokeDasharray="5 5"
            label={{
              value: `v_p = ${vProbable.toFixed(0)} м/с`,
              fill: "#fca5a5",
              position: "top",
              fontSize: 12,
            }}
          />
          <ReferenceLine
            x={vAverage}
            stroke="#10b981"
            strokeDasharray="5 5"
            label={{
              value: `v_avg = ${vAverage.toFixed(0)} м/с`,
              fill: "#6ee7b7",
              position: "top",
              fontSize: 12,
            }}
          />
          <ReferenceLine
            x={vRms}
            stroke="#f97316"
            strokeDasharray="5 5"
            label={{
              value: `v_rms = ${vRms.toFixed(0)} м/с`,
              fill: "#fdba74",
              position: "top",
              fontSize: 12,
            }}
          />

          <Line
            type="monotone"
            dataKey="f"
            stroke="#3b82f6"
            dot={false}
            isAnimationActive={false}
            name="f(v)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
