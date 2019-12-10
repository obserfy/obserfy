/* eslint-disable import/no-extraneous-dependencies */
import React, { FC, ReactElement } from "react"
import { ThemeProvider } from "theme-ui"
import { render, RenderOptions, RenderResult } from "@testing-library/react"
import { IntlProvider } from "gatsby-plugin-intl3"
import Theme from "./gatsby-plugin-theme-ui"
import Box from "./components/Box/Box"
import en from "./intl/en.json"

const AllProviders: FC = ({ children }) => (
  <ThemeProvider theme={Theme}>
    <IntlProvider locale="en" messages={en}>
      <Box fontSize={[16, 20]}>{children}</Box>
    </IntlProvider>
  </ThemeProvider>
)

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">
): RenderResult => render(ui, { wrapper: AllProviders, ...options })

// re-export everything
export * from "@testing-library/react"

// override render method
export { customRender as render }
