import { ThemeProvider, useColorMode } from "theme-ui"
import Theme from "../src/gatsby-plugin-theme-ui"
import { Box } from "../src/components/Box/Box"
import { addDecorator, addParameters } from "@storybook/react"
import { IntlProvider } from "gatsby-plugin-intl3"
import { withI18n } from "storybook-addon-i18n"
import { action } from "@storybook/addon-actions"
import React, { useEffect } from "react"
import { createHistory, createMemorySource, LocationProvider } from "@reach/router"
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport"
import "../src/global.css"
import { DocsPage } from "storybook-addon-deps/blocks"
import Flex from "../src/components/Flex/Flex"
import { select } from "@storybook/addon-knobs"

const history = createHistory(createMemorySource("/"))
const ThemeDecorator = story => {
  return (
    <LocationProvider history={history}>
      <ThemeProvider theme={Theme}>
        <ThemeSwitcher />
        <Box backgroundColor="background">{story()}</Box>
      </ThemeProvider>
    </LocationProvider>
  )
}
const ThemeSwitcher = () => {
  const [, setColorMode] = useColorMode()
  const theme = select("Theme", { dark: "dark", light: "default" }, "dark")

  useEffect(() => {
    setColorMode(theme)
  }, [theme, setColorMode])

  return <Flex m={2} sx={{ position: "fixed", right: 0, top: 0 }} />
}
addDecorator(ThemeDecorator)

// ================================ i18n ===============================================
addParameters({
  i18n: {
    provider: IntlProvider,
    providerProps: {},
    supportedLocales: ["en", "id"],
    providerLocaleKey: "locale",
  },
})
addDecorator(withI18n)

// ==================================== Viewports =======================================
addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
})

// ==================================== DocsPage =======================================
addParameters({
  docs: { page: DocsPage },
})

// ===================================== Gatsby ===========================================
// Make gatsby components work on storybook.
// Gatsby's Link overrides:
// Gatsby defines a global called ___loader to prevent its method calls from creating console errors you override it here
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
}
// Gatsby internal mocking to prevent unnecessary errors in storybook testing environment
global.__PATH_PREFIX__ = ""
// This is to utilized to override the window.___navigate method Gatsby defines and uses to report what path a Link would be taking us to if it wasn't inside a storybook
window.___navigate = pathname => {
  action("NavigateTo:")(pathname)
}
