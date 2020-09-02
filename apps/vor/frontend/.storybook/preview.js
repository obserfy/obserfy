import { Box, ThemeProvider } from "theme-ui";
import Theme from "../src/gatsby-plugin-theme-ui";
import { addDecorator } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import React from "react";
import { createHistory, createMemorySource, LocationProvider } from "@reach/router";
import "../src/global.css";

const history = createHistory(createMemorySource("/"))
const ComponentWrapper = (story) => (
  <LocationProvider history={history}>
    <ThemeProvider theme={Theme}>
      <Box sx={{ backgroundColor: "background" }}>{story()}</Box>
    </ThemeProvider>
  </LocationProvider>
)

addDecorator(ComponentWrapper)

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
global.__BASE_PATH__ = ""
// This is to utilized to override the window.___navigate method Gatsby defines and uses to report what path a Link would be taking us to if it wasn't inside a storybook
window.___navigate = (pathname) => {
  action("NavigateTo:")(pathname)
}
