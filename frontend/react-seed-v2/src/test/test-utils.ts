import * as React from 'react'
import { render, screen, waitFor, fireEvent, act, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import type { RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(BrowserRouter, null, children)
  )

  return render(ui, {
    wrapper: Wrapper,
    ...options,
  })
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

// Explicit named exports so IDE can resolve them statically
export { screen, waitFor, fireEvent, act, within }

// Override render with the custom BrowserRouter-wrapped version
export { customRender as render }
