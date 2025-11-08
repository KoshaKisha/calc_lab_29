const BOLTZMANN_CONSTANT = 1.38064852e-23 // Дж/К
const GAS_CONSTANT = 8.31 // Дж/(моль∙К)
const PI = Math.PI

export interface GasProperties {
  name: string
  M: number // молярная масса в кг/моль
  T: number // температура в К
}

export interface TableResults {
  v_probable: number // наиболее вероятная скорость
  v_average: number // средняя арифметическая скорость
  v_rms: number // средняя квадратичная скорость
  relativeErrors: Record<string, number> // относительные погрешности
}

export interface DistributionPoint {
  v: number
  f_v: number // функция распределения
}

// Функция распределения Максвелла F(v)
export function maxwellDistribution(v: number, T: number, M: number): number {
  const m0 = M / 1000 / 6.022e23 // масса молекулы в кг
  const coefficient = 4 * PI * Math.pow(m0 / (2 * PI * BOLTZMANN_CONSTANT * T), 1.5)
  const exponent = Math.exp(-(m0 * v * v) / (2 * BOLTZMANN_CONSTANT * T))
  return coefficient * v * v * exponent
}

// Наиболее вероятная скорость (m0 -> M)
export function probableVelocity(T: number, M: number): number {
  return Math.sqrt((2 * GAS_CONSTANT * T) / (M / 1000))
}

// Средняя арифметическая скорость
export function averageVelocity(T: number, M: number): number {
  return Math.sqrt((8 * GAS_CONSTANT * T) / (PI * (M / 1000)))
}

// Средняя квадратичная скорость (RMS)
export function rmsVelocity(T: number, M: number): number {
  return Math.sqrt((3 * GAS_CONSTANT * T) / (M / 1000))
}

// Генерация точек распределения для графика
export function generateDistributionCurve(T: number, M: number, maxV = 4000): DistributionPoint[] {
  const points: DistributionPoint[] = []
  const step = 50
  for (let v = 0; v <= maxV; v += step) {
    points.push({
      v,
      f_v: maxwellDistribution(v, T, M),
    })
  }
  return points
}

// Приближенный расчет дельта-N (число молекул в интервале скорости)
export function moleculesInInterval(v: number, deltaV: number, T: number, M: number, totalN = 100): number {
  const f_v = maxwellDistribution(v, T, M)
  return f_v * deltaV * totalN
}

// Относительная погрешность
export function relativeError(experimental: number, theoretical: number): number {
  if (theoretical === 0) return 0
  return Math.abs((experimental - theoretical) / theoretical) * 100
}

// Определение молярной массы по наклону прямой v² = f(T)
export function molarMassFromSlope(slope: number): number {
  // slope = 8R / M => M = 8R / slope
  return (8 * GAS_CONSTANT) / slope
}
