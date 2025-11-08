"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { probableVelocity, averageVelocity, rmsVelocity } from "@/lib/lab-calculator"

const GASES: Record<string, number> = {
  "N₂": 28,
  "O₂": 32,
  "H₂": 2,
  He: 4,
  Air: 29,
  "CO₂": 44,
}

export function LabQuickCalculator() {
  const [temperature, setTemperature] = useState(300)
  const [selectedGas, setSelectedGas] = useState("N₂")
  const [customMass, setCustomMass] = useState<number | null>(null)

  const M = customMass ?? GASES[selectedGas]

  const v_prob = probableVelocity(temperature, M)
  const v_avg = averageVelocity(temperature, M)
  const v_rms = rmsVelocity(temperature, M)

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-700/50">
      <h3 className="text-lg font-bold text-white mb-4">Быстрый расчет характерных скоростей</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
              value={selectedGas}
              onChange={(e) => {
                setSelectedGas(e.target.value)
                setCustomMass(null)
              }}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
            >
              {Object.keys(GASES).map((gas) => (
                <option key={gas} value={gas}>
                  {gas}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Молярная масса (г/моль) - опционально</label>
          <Input
            type="number"
            value={customMass ?? ""}
            onChange={(e) => setCustomMass(e.target.value ? Number(e.target.value) : null)}
            placeholder={`По умолчанию: ${M}`}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/50 rounded-lg border border-slate-700">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">v_в (вероятная)</p>
            <p className="text-lg font-bold text-cyan-400">{v_prob.toFixed(1)} м/с</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">v̄ (средняя)</p>
            <p className="text-lg font-bold text-green-400">{v_avg.toFixed(1)} м/с</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">v_кв (квадр.)</p>
            <p className="text-lg font-bold text-orange-400">{v_rms.toFixed(1)} м/с</p>
          </div>
        </div>

        <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-600 text-xs text-slate-300 space-y-1">
          <p>Соотношение скоростей:</p>
          <p>
            v_в : v̄ : v_кв = 1 : {(v_avg / v_prob).toFixed(3)} : {(v_rms / v_prob).toFixed(3)}
          </p>
          <p className="pt-2">Процентные разницы:</p>
          <p>v̄ на {(((v_avg - v_prob) / v_prob) * 100).toFixed(1)}% больше v_в</p>
          <p>v_кв на {(((v_rms - v_prob) / v_prob) * 100).toFixed(1)}% больше v_в</p>
        </div>
      </div>
    </Card>
  )
}
