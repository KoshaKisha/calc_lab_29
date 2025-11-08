"use client"

import { MaxwellCalculator } from "@/lib/maxwell-calculator"
import { Card } from "@/components/ui/card"

interface ResultsDisplayProps {
  T: number
  M: number
  gasName: string
}

export function ResultsDisplay({ T, M, gasName }: ResultsDisplayProps) {
  const calc = new MaxwellCalculator()
  const speeds = calc.characteristicSpeeds(T, M)

  const formatSpeed = (speed: number) => speed.toFixed(1)

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700 shadow-lg">
          <p className="text-blue-200 text-sm font-medium mb-1">Наиболее вероятная</p>
          <p className="text-3xl font-bold text-blue-100">{formatSpeed(speeds.vProbable)}</p>
          <p className="text-blue-300 text-xs mt-1">м/с</p>
          <p className="text-blue-400 text-xs mt-2">v_p = √(2RT/M)</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-900 to-emerald-800 border-emerald-700 shadow-lg">
          <p className="text-emerald-200 text-sm font-medium mb-1">Средняя</p>
          <p className="text-3xl font-bold text-emerald-100">{formatSpeed(speeds.vAverage)}</p>
          <p className="text-emerald-300 text-xs mt-1">м/с</p>
          <p className="text-emerald-400 text-xs mt-2">v_avg = √(8RT/πM)</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-900 to-orange-800 border-orange-700 shadow-lg">
          <p className="text-orange-200 text-sm font-medium mb-1">Среднеквадратичная</p>
          <p className="text-3xl font-bold text-orange-100">{formatSpeed(speeds.vRms)}</p>
          <p className="text-orange-300 text-xs mt-1">м/с</p>
          <p className="text-orange-400 text-xs mt-2">v_rms = √(3RT/M)</p>
        </Card>
      </div>

      <Card className="p-4 bg-slate-800 border-slate-700 shadow-lg">
        <p className="text-slate-300 text-sm">
          <span className="font-semibold text-slate-100">{gasName}</span> при{" "}
          <span className="font-semibold text-slate-100">{T} K</span> и молярной массе{" "}
          <span className="font-semibold text-slate-100">{(M * 1000).toFixed(1)} г/моль</span>
        </p>
      </Card>
    </div>
  )
}
