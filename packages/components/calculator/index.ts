import Calculator from './src/calculator.vue'

import type { App } from 'vue'

Calculator.install = (app: App): void => {
  app.component(Calculator.name, Calculator)
}

export default Calculator
export const LyCalculator = Calculator
