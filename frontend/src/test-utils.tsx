/* eslint-disable import/no-extraneous-dependencies */
import React, { FC, ReactElement } from "react"
import { ThemeProvider } from "theme-ui"
import { render, RenderOptions, RenderResult } from "@testing-library/react"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@reach/router"
import Theme from "./gatsby-plugin-theme-ui"
import Box from "./components/Box/Box"

const AllProviders: FC = ({ children }) => {
  // TODO: Maybe this better be outside
  const history = createHistory(createMemorySource("/"))
  return (
    <LocationProvider history={history}>
      <ThemeProvider theme={Theme}>
        <Box fontSize={[16, 20]}>{children}</Box>
      </ThemeProvider>
    </LocationProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">
): RenderResult => render(ui, { wrapper: AllProviders, ...options })

// re-export everything
export * from "@testing-library/react"

// override render method
export { customRender as render }
