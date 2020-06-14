import React, { FC } from "react"
import { Global } from "@emotion/core"
import Layout from "../components/Layout/Layout"
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary"
import Box from "../components/Box/Box"

// Used by gatsby-plugin-layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LayoutManager: FC<any> = ({ children, pageContext }) => (
  <ErrorBoundary>
    <GlobalStyle />
    {pageContext.layout === "open" ? (
      <Box backgroundColor="background">{children}</Box>
    ) : (
      <Layout>{children}</Layout>
    )}
  </ErrorBoundary>
)

const GlobalStyle: FC = () => (
  <Global
    styles={(theme) => ({
      body: {
        backgroundColor: theme.colors.background,
      },
    })}
  />
)

export default LayoutManager
