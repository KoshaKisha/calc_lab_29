"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { averageVelocity, molarMassFromSlope, relativeError } from "@/lib/lab-calculator"

interface Table4Data {
  T: number
  N_total: number
  v_average: number
  v_squared: number
  gasName: string
  v_theoretical: number
  relError: number
}

interface Props {
  tableDataArray: Array<{
    T: number
    measurements: Array<{ v: number; delta_n_avg: number }>
  }>
}

export function LabTable4Calculator({ tableDataArray }: Props) {
  const [molarMass, setMolarMass] = useState(28)
  const [results, setResults] = useState<Table4Data[]>([])

  const calculateTable4 = () => {
    const newResults: Table4Data[] = tableDataArray.map(({ T, measurements }) => {
      // Общее число молекул N
      const N_total = measurements.reduce((sum, m) => sum + m.delta_n_avg, 0)

      // Средняя арифметическая скорость по формуле (5.47)
      const v_average =
        measurements.length > 0 ? measurements.reduce((sum, m) => sum + m.v * m.delta_n_avg, 0) / N_total : 0

      const v_squared = v_average * v_average

      // Теоретическое значение
      const v_theoretical = averageVelocity(T, molarMass)

      // Относительная погрешность
      const relError = relativeError(v_average, v_theoretical)

      return {
        T,
        N_total,
        v_average,
        v_squared,
        gasName: "N₂", // по умолчанию
        v_theoretical,
        relError,
      }
    })

    setResults(newResults)
  }

  // Расчет молярной массы по наклону
  const calculateMolarMass = () => {
    if (results.length < 2) return
    const t1 = results[0]
    const t2 = results[results.length - 1]

    const slope = (t2.v_squared - t1.v_squared) / (t2.T - t1.T)
    const calculatedM = molarMassFromSlope(slope)
    setMolarMass(calculatedM)
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Таблица 5.4 - Определение молярной массы</h3>

      <div className="space-y-4 mb-6">
        <button
          onClick={calculateTable4}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          Рассчитать таблицу 5.4
        </button>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Молярная масса газа (г/моль)</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={molarMass}
              onChange={(e) => setMolarMass(Number(e.target.value))}
              className="flex-1 bg-slate-700 border-slate-600 text-white"
            />
            <button
              onClick={calculateMolarMass}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
            >
              По графику
            </button>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-2 px-2 text-slate-300">T (К)</th>
                <th className="text-left py-2 px-2 text-slate-300">N</th>
                <th className="text-left py-2 px-2 text-slate-300">v̄ (м/с)</th>
                <th className="text-left py-2 px-2 text-slate-300">v̄² (м²/с²)</th>
                <th className="text-left py-2 px-2 text-slate-300">v̄ теор (м/с)</th>
                <th className="text-left py-2 px-2 text-slate-300">Погр. (%)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-600">
                  <td className="py-3 px-2 text-slate-100">{row.T}</td>
                  <td className="py-3 px-2 text-slate-100">{row.N_total.toFixed(1)}</td>
                  <td className="py-3 px-2 text-slate-100">{row.v_average.toFixed(1)}</td>
                  <td className="py-3 px-2 text-slate-100">{row.v_squared.toFixed(0)}</td>
                  <td className="py-3 px-2 text-slate-100">{row.v_theoretical.toFixed(1)}</td>
                  <td className="py-3 px-2 text-orange-400 font-medium">{row.relError.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
