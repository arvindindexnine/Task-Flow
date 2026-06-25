import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup() // cleanup after each test to avoid memory leaks and prevent tests from affecting each other and polluting the DOM.
})

// Mock react-chartjs-2 since JSDOM doesn't support canvas
vi.mock('react-chartjs-2', () => ({
  Line: () => null,
  Doughnut: () => null,
  Bar: () => null,
  Pie: () => null,
  Scatter: () => null,
  Bubble: () => null,
  PolarArea: () => null,
  Radar: () => null,
})); 