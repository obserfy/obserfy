// You are also able to use a 3rd party theme this way:
import "@emotion/react"
import { ObserfyTheme } from "./gatsby-plugin-theme-ui"

declare module "@emotion/react" {
  export interface Theme extends ObserfyTheme {}
}
