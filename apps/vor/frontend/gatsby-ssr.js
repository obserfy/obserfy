import React from "react"

/** * Gatsby SSR config: https://www.gatsbyjs.org/docs/ssr-apis/ */
export const onRenderBody = ({ setHeadComponents }) => {
  if (process.env.NODE_ENV === "development") return
  setHeadComponents([<script src="/mixpanel-lite.min.js" />])
}
