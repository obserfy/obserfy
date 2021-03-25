import React from "react"
/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it
export const onRenderBody = ({setHeadComponents}) => {
  if (process.env.NODE_ENV === "development") return

  setHeadComponents([
    <script async src="/mixpanel-lite.min.js"/>
  ])
}
