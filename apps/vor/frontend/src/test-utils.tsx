/* eslint-disable import/no-extraneous-dependencies */
import React, { FC, ReactElement } from "react"
import { ThemeProvider, Box } from "theme-ui"
import { render, RenderOptions, RenderResult } from "@testing-library/react"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@reach/router"
import { I18nProvider } from "@lingui/react"
import { setupI18n } from "@lingui/core"
import { en } from "make-plural/plurals"
import Theme from "./gatsby-plugin-theme-ui"
import enCatalog from "../i18n/lingui/en/messages.js"

const i18n = setupI18n()
// any used here because the catalogs are generated b lingui
// not our responsibility
i18n.loadLocaleData("en", { plurals: en })
i18n.load("en", enCatalog.messages as any)
i18n.activate("en")

const AllProviders: FC = ({ children }) => {
  // TODO: Maybe this better be outside
  const history = createHistory(createMemorySource("/"))
  return (
    <I18nProvider i18n={i18n}>
      <LocationProvider history={history}>
        <ThemeProvider theme={Theme}>
          <Box sx={{ fontSize: [16, 20] }}>{children}</Box>
        </ThemeProvider>
      </LocationProvider>
    </I18nProvider>
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
