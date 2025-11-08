"use client"

import { MaxwellCalculator } from "@/lib/maxwell-calculator"
import { Card } from "@/components/ui/card"

interface DistributionValuesTableProps {
  T: number
  M: number
}

export function DistributionValuesTable({ T, M }: DistributionValuesTableProps) {
  const calc = new MaxwellCalculator()
  const data = calc.getDistributionTable(T, M, 20)

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-lg overflow-x-auto">
      <h3 className="text-xl font-bold text-slate-50 mb-4">Значения функции распределения</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-600">
            <th className="text-center px-4 py-3 text-slate-300 font-semibold">Скорость v (м/с)</th>
            <th className="text-center px-4 py-3 text-slate-300 font-semibold">f(v)</th>
            <th className="text-center px-4 py-3 text-slate-300 font-semibold">Относительная v/v_p</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point, idx) => (
            <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
              <td className="text-center px-4 py-3 text-slate-100 font-medium">{point.v.toFixed(1)}</td>
              <td className="text-center px-4 py-3 text-slate-300">{point.f.toExponential(2)}</td>
              <td className="text-center px-4 py-3 text-slate-300">{point.relativeV.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
