// You are also able to use a 3rd party theme this way:
import "@emotion/react"
import { Theme as ThemeUITheme } from "theme-ui"

declare module "@emotion/react" {
  export interface Theme extends ThemeUITheme {}
}
