"use client"

import { MaxwellCalculator } from "@/lib/maxwell-calculator"
import { Card } from "@/components/ui/card"

interface ProbabilityTableProps {
  T: number
  M: number
}

export function ProbabilityTable({ T, M }: ProbabilityTableProps) {
  const calc = new MaxwellCalculator()
  const intervals = calc.getProbabilityIntervals(T, M)

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-lg overflow-x-auto">
      <h3 className="text-xl font-bold text-slate-50 mb-4">Вероятности в интервалах скоростей</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-600">
            <th className="text-left px-4 py-3 text-slate-300 font-semibold">Интервал</th>
            <th className="text-center px-4 py-3 text-slate-300 font-semibold">Диапазон (м/с)</th>
            <th className="text-center px-4 py-3 text-slate-300 font-semibold">Вероятность</th>
            <th className="text-center px-4 py-3 text-slate-300 font-semibold">Доля молекул, %</th>
          </tr>
        </thead>
        <tbody>
          {intervals.map((interval, idx) => (
            <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
              <td className="px-4 py-3 text-slate-100 font-medium">{interval.label}</td>
              <td className="text-center px-4 py-3 text-slate-300">{interval.range}</td>
              <td className="text-center px-4 py-3 text-slate-300">{interval.probability.toFixed(4)}</td>
              <td className="text-center px-4 py-3">
                <span className="bg-blue-600 text-slate-50 px-3 py-1 rounded-full text-xs font-semibold">
                  {interval.percentage.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
