/* eslint-disable import/no-extraneous-dependencies */
import { FC, ReactElement } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { ThemeProvider, Box, Theme } from "theme-ui"
import { render, RenderOptions, RenderResult } from "@testing-library/react"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@reach/router"
import { I18nProvider } from "@lingui/react"
import { i18n } from "@lingui/core"
import { en } from "make-plural/plurals"
import theme from "./gatsby-plugin-theme-ui"
// @ts-ignore
import enCatalog from "../i18n/lingui/en/messages.js"

// any used here because the catalogs are generated b lingui
// not our responsibility
i18n.loadLocaleData("en", { plurals: en })
i18n.load("en", enCatalog.messages as any)
i18n.activate("en")

const queryClient = new QueryClient()
const history = createHistory(createMemorySource("/"))

const AllProviders: FC = ({ children }) => {
  return (
    <I18nProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <LocationProvider history={history}>
          <ThemeProvider theme={theme as Theme}>
            <Box sx={{ fontSize: [16, 20] }}>{children}</Box>
          </ThemeProvider>
        </LocationProvider>
      </QueryClientProvider>
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
