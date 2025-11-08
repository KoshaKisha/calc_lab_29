"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { probableVelocity } from "@/lib/lab-calculator"

interface TableData {
  temperature: number
  gasName: string
  speedValues: number[]
  measurements: {
    v: number
    delta_n_1: number
    delta_n_2: number
    delta_n_avg: number
  }[]
}

interface Props {
  tableNumber: number
  onDataChange: (data: TableData) => void
}

export function LabTablesInput({ tableNumber, onDataChange }: Props) {
  const speedValues = [500, 1000, 1500, 2000, 2500, 3000, 3500]
  const [temperature, setTemperature] = useState(300)
  const [gasName, setGasName] = useState("N₂")
  const M_values: Record<string, number> = {
    "N₂": 28,
    "O₂": 32,
    "H₂": 2,
    He: 4,
    Air: 29,
  }
  const M = M_values[gasName] || 28
  const v_prob_theoretical = probableVelocity(temperature, M)

  const [measurements, setMeasurements] = useState<TableData["measurements"]>(
    speedValues.map((v) => ({ v, delta_n_1: 0, delta_n_2: 0, delta_n_avg: 0 })),
  )

  const handleMeasurementChange = (index: number, field: string, value: number) => {
    const newMeasurements = [...measurements]
    if (field === "delta_n_1" || field === "delta_n_2") {
      newMeasurements[index][field as "delta_n_1" | "delta_n_2"] = value
      newMeasurements[index].delta_n_avg = (newMeasurements[index].delta_n_1 + newMeasurements[index].delta_n_2) / 2
    }
    setMeasurements(newMeasurements)

    onDataChange({
      temperature,
      gasName,
      speedValues,
      measurements: newMeasurements,
    })
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Таблица 5.{tableNumber}</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Температура (К)</label>
          <Input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Газ</label>
          <select
            value={gasName}
            onChange={(e) => setGasName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
          >
            {Object.keys(M_values).map((gas) => (
              <option key={gas} value={gas}>
                {gas}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
        <p className="text-sm text-blue-100">
          <strong>Теоретическая v_в:</strong> {v_prob_theoretical.toFixed(1)} м/с
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="text-left py-2 px-2 text-slate-300">v [м/с]</th>
              {[500, 1000, 1500, 2000, 2500, 3000, 3500].map((v) => (
                <th key={v} className="text-center py-2 px-1 text-slate-300">
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-600">
              <td className="py-3 px-2 text-slate-300">ΔN (1-е)</td>
              {measurements.map((m, idx) => (
                <td key={idx} className="text-center py-2 px-1">
                  <Input
                    type="number"
                    value={m.delta_n_1 || ""}
                    onChange={(e) => handleMeasurementChange(idx, "delta_n_1", Number(e.target.value))}
                    className="w-16 h-8 text-xs text-center bg-slate-700 border-slate-600 text-white"
                    placeholder="0"
                  />
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-600">
              <td className="py-3 px-2 text-slate-300">ΔN (2-е)</td>
              {measurements.map((m, idx) => (
                <td key={idx} className="text-center py-2 px-1">
                  <Input
                    type="number"
                    value={m.delta_n_2 || ""}
                    onChange={(e) => handleMeasurementChange(idx, "delta_n_2", Number(e.target.value))}
                    className="w-16 h-8 text-xs text-center bg-slate-700 border-slate-600 text-white"
                    placeholder="0"
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-2 font-semibold text-blue-300">Среднее ΔN</td>
              {measurements.map((m, idx) => (
                <td key={idx} className="text-center py-2 px-1 text-blue-100 font-medium">
                  {m.delta_n_avg.toFixed(1)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}
