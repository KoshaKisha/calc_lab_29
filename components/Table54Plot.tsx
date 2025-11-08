"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { linearRegression, molarMassFromSlope } from "@/lib/lab-calculator"

interface Props {
  results: Array<{
    T: number
    v_squared: number
  }>
}

export function Table54Plot({ results }: Props) {
  if (!results || results.length < 2) {
    return (
      <Card className="p-6 bg-slate-800 text-slate-200">
        Недостаточно данных для построения графика
      </Card>
    )
  }

  const xs = results.map((r) => r.T)
  const ys = results.map((r) => r.v_squared)

  const { slope, intercept, stderrSlope } = linearRegression(xs, ys)
  const Mcalc = molarMassFromSlope(slope)
  const Mstderr = slope !== 0 ? Math.abs(Mcalc) * (stderrSlope / Math.abs(slope)) : 0

  // Для линии регрессии на графике
  const regressionLine = results.map((r) => ({
    T: r.T,
    v_squared_reg: intercept + slope * r.T,
  }))

  const data = results.map((r, i) => ({
    T: r.T,
    v_squared: r.v_squared,
    v_squared_reg: regressionLine[i].v_squared_reg,
  }))

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <h3 className="text-xl font-bold text-slate-100 mb-4">
        График зависимости v̄²(T) — Таблица 5.4
      </h3>

      <div className="w-full h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis
              dataKey="T"
              stroke="#cbd5e1"
              label={{ value: "T (K)", position: "insideBottom", fill: "#cbd5e1", offset: -5 }}
            />
            <YAxis
              stroke="#cbd5e1"
              label={{ value: "v̄² (м²/с²)", angle: -90, fill: "#cbd5e1", position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Line name="Эксп. точки" type="monotone" dataKey="v_squared" dot strokeWidth={2} />
            <Line
              name="Линейная аппроксимация"
              type="linear"
              dataKey="v_squared_reg"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg text-slate-200 space-y-1 text-sm">
        <p>Наклон: <strong>{slope.toExponential(3)}</strong> (м²/с²·К⁻¹)</p>
        <p>Молярная масса: <strong>{Mcalc.toFixed(2)}</strong> ± {Mstderr.toFixed(2)} г/моль</p>
        <p>Уравнение: v̄² = ({slope.toExponential(3)})·T + ({intercept.toExponential(3)})</p>
      </div>
    </Card>
  )
}
