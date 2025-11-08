// Maxwell Distribution Calculator - Core Physics Logic

const BOLTZMANN_CONSTANT = 1.380649e-23 // J/K
const AVOGADRO = 6.02214076e23

export interface MaxwellResults {
  vProbable: number // Наиболее вероятная скорость
  vAverage: number // Средняя скорость
  vRms: number // Среднеквадратичная скорость
}

export interface DistributionPoint {
  v: number
  f: number
  relativeV: number
}

export interface ProbabilityInterval {
  label: string
  probability: number
  percentage: number
  range: string
}

export class MaxwellCalculator {
  private R: number = BOLTZMANN_CONSTANT * AVOGADRO // Универсальная газовая постоянная

  /**
   * Функция распределения Максвелла по скоростям
   */
  maxwellDistribution(v: number, T: number, M: number): number {
    const m = M / AVOGADRO // Масса одной молекулы
    const a = m / (2 * BOLTZMANN_CONSTANT * T)

    if (a <= 0 || T <= 0) return 0

    const f = 4 * Math.PI * Math.pow(a / Math.PI, 1.5) * v * v * Math.exp(-a * v * v)
    return f
  }

  /**
   * Вычисление характерных скоростей
   */
  characteristicSpeeds(T: number, M: number): MaxwellResults {
    if (T <= 0 || M <= 0) return { vProbable: 0, vAverage: 0, vRms: 0 }

    const vProbable = Math.sqrt((2 * this.R * T) / M)
    const vAverage = Math.sqrt((8 * this.R * T) / (Math.PI * M))
    const vRms = Math.sqrt((3 * this.R * T) / M)

    return { vProbable, vAverage, vRms }
  }

  /**
   * Получить значения распределения для графика
   */
  getDistributionData(T: number, M: number, points = 100): DistributionPoint[] {
    const { vProbable, vRms } = this.characteristicSpeeds(T, M)

    if (vRms === 0) return []

    const maxV = vRms * 2.5
    const data: DistributionPoint[] = []

    for (let i = 0; i <= points; i++) {
      const v = (i / points) * maxV
      const f = this.maxwellDistribution(v, T, M)
      data.push({
        v,
        f,
        relativeV: vProbable > 0 ? v / vProbable : 0,
      })
    }

    return data
  }

  /**
   * Вероятность в интервале скоростей (числовое интегрирование)
   */
  private integrateProbability(vMin: number, vMax: number, T: number, M: number, steps = 1000): number {
    const dv = (vMax - vMin) / steps
    let sum = 0

    for (let i = 0; i < steps; i++) {
      const v = vMin + (i + 0.5) * dv
      sum += this.maxwellDistribution(v, T, M) * dv
    }

    return sum
  }

  /**
   * Вероятности в различных интервалах скоростей
   */
  getProbabilityIntervals(T: number, M: number): ProbabilityInterval[] {
    const { vProbable, vAverage, vRms } = this.characteristicSpeeds(T, M)

    const intervals = [
      { min: 0, max: vProbable, label: "0 - vₚ" },
      { min: vProbable, max: vAverage, label: "vₚ - vₛᵣ" },
      { min: vAverage, max: vRms, label: "vₛᵣ - vₛₖ" },
      { min: vRms, max: 2 * vRms, label: "vₛₖ - 2vₛₖ" },
      { min: 2 * vRms, max: 3 * vRms, label: "2vₛₖ - 3vₛₖ" },
    ]

    return intervals.map((interval) => {
      const probability = this.integrateProbability(interval.min, interval.max, T, M)
      return {
        label: interval.label,
        probability,
        percentage: probability * 100,
        range: `${interval.min.toFixed(0)} - ${interval.max.toFixed(0)} м/с`,
      }
    })
  }

  /**
   * Получить таблицу значений распределения
   */
  getDistributionTable(T: number, M: number, points = 20): DistributionPoint[] {
    const { vProbable, vRms } = this.characteristicSpeeds(T, M)

    if (vRms === 0) return []

    const maxV = vRms * 2.5
    const table: DistributionPoint[] = []

    for (let i = 0; i <= points; i++) {
      const v = (i / points) * maxV
      const f = this.maxwellDistribution(v, T, M)
      table.push({
        v,
        f,
        relativeV: vProbable > 0 ? v / vProbable : 0,
      })
    }

    return table
  }
}
