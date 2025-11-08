"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export interface GasParams {
  name: string
  T: number
  M: number
}

interface InputFormProps {
  onCalculate: (params: GasParams) => void
  isLoading?: boolean
}

const PREDEFINED_GASES: Record<string, { T: number; M: number }> = {
  "Азот (N₂)": { T: 300, M: 0.028 },
  "Кислород (O₂)": { T: 300, M: 0.032 },
  "Водород (H₂)": { T: 300, M: 0.002 },
  "Гелий (He)": { T: 300, M: 0.004 },
  Воздух: { T: 300, M: 0.029 },
}

export function InputForm({ onCalculate, isLoading = false }: InputFormProps) {
  const [selectedGas, setSelectedGas] = useState<string>("Азот (N₂)")
  const [T, setT] = useState<number>(300)
  const [M, setM] = useState<number>(0.028)
  const [useCustom, setUseCustom] = useState(false)

  const handleGasSelect = (gasName: string) => {
    const params = PREDEFINED_GASES[gasName]
    setSelectedGas(gasName)
    setT(params.T)
    setM(params.M)
    setUseCustom(false)
  }

  const handleCalculate = () => {
    onCalculate({
      name: useCustom ? "Пользовательский газ" : selectedGas,
      T,
      M,
    })
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-lg">
      <h2 className="text-2xl font-bold text-slate-50 mb-6">Параметры</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">Предопределенные газы</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.keys(PREDEFINED_GASES).map((gas) => (
            <button
              key={gas}
              onClick={() => handleGasSelect(gas)}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                !useCustom && selectedGas === gas
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-700 text-slate-200 hover:bg-slate-600"
              }`}
            >
              {gas}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Температура (T), K</label>
          <input
            type="number"
            value={T}
            onChange={(e) => {
              setT(Number.parseFloat(e.target.value) || 300)
              setUseCustom(true)
            }}
            min="1"
            step="10"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Молярная масса (M), кг/моль</label>
          <input
            type="number"
            value={M}
            onChange={(e) => {
              setM(Number.parseFloat(e.target.value) || 0.028)
              setUseCustom(true)
            }}
            min="0.001"
            step="0.001"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <Button
        onClick={handleCalculate}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition-all"
      >
        {isLoading ? "Расчет..." : "Рассчитать"}
      </Button>
    </Card>
  )
}
