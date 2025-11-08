"use client"

import { useState } from "react"
import { LabTablesInput } from "@/components/lab-tables-input"
import { LabQuickCalculator } from "@/components/lab-quick-calculator"
import { LabTable4Calculator } from "@/components/lab-table4-calculator"

export default function Home() {
  const [table1Data, setTable1Data] = useState<any>(null)
  const [table2Data, setTable2Data] = useState<any>(null)
  const [table3Data, setTable3Data] = useState<any>(null)

  const allTableData = [
    table1Data && { T: table1Data.temperature, measurements: table1Data.measurements },
    table2Data && { T: table2Data.temperature, measurements: table2Data.measurements },
    table3Data && { T: table3Data.temperature, measurements: table3Data.measurements },
  ].filter(Boolean)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 border-b border-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Лабораторная работа №29k</h1>
          <p className="text-blue-100 text-lg">Распределение Максвелла молекул газа по скоростям</p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Quick calculator */}
          <LabQuickCalculator />

          {/* Lab tables */}
          <div className="grid lg:grid-cols-3 gap-6">
            <LabTablesInput tableNumber={1} onDataChange={setTable1Data} />
            <LabTablesInput tableNumber={2} onDataChange={setTable2Data} />
            <LabTablesInput tableNumber={3} onDataChange={setTable3Data} />
          </div>

          {/* Table 5.4 calculator */}
          {allTableData.length > 0 && <LabTable4Calculator tableDataArray={allTableData as any} />}

          {/* Control questions */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Контрольные вопросы</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-300 mb-2">
                  1. Как в работе получаются кривые распределения Максвелла?
                </h3>
                <p className="text-slate-300">
                  На модели установки создается система частиц, движущихся в замкнутом объеме. Путем остановки и
                  подсчета молекул в определенных диапазонах скоростей строится график зависимости ΔN = f(v), который
                  иллюстрирует функцию распределения Максвелла.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-300 mb-2">
                  2. Характерные скорости молекул в распределении Максвелла:
                </h3>
                <p className="text-slate-300">
                  • Наиболее вероятная скорость v_в = √(2RT/M) - соответствует максимуму распределения
                  <br />• Средняя арифметическая скорость v̄ = √(8RT/πM)
                  <br />• Средняя квадратичная скорость v_кв = √(3RT/M)
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-300 mb-2">
                  3. Определение средних скоростей по данным измерений:
                </h3>
                <p className="text-slate-300">
                  По формуле (5.47): v̄ = Σ(N(v_i) × v_i × Δv) / N. Для каждой температуры рассчитываем взвешенное
                  среднее значение скорости на основе количества молекул в каждом интервале.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-300 mb-2">4. Определение вида исследуемого газа:</h3>
                <p className="text-slate-300">
                  По формуле (5.49) определяется молярная масса: M = 8R/b, где b - угловой коэффициент графика v̄² =
                  f(T). Затем по таблице 5.5 подбирается газ с наиболее близкой молярной массой.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-300 mb-2">5. Процентные отличия характерных скоростей:</h3>
                <p className="text-slate-300">
                  v_в : v̄ : v_кв = 1 : 1.1284 : 1.2247
                  <br />
                  v̄ отличается от v_в на ~12.84%, v_кв отличается на ~22.47%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
