import React, { FC } from "react"
import { Global } from "@emotion/core"
import Layout from "../components/Layout/Layout"
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary"
import Box from "../components/Box/Box"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LayoutManager: FC<any> = ({ children, pageContext }) => {
  if (pageContext.layout === "open") {
    return (
      <ErrorBoundary>
        <GlobalStyle />
        <Box backgroundColor="background">{children}</Box>
      </ErrorBoundary>
    )
  }
  return (
    <>
      <GlobalStyle />
      <ErrorBoundary>
        <Layout>{children}</Layout>
      </ErrorBoundary>
    </>
  )
}

const GlobalStyle: FC = () => (
  <Global
    styles={theme => ({
      body: {
        backgroundColor: theme.colors.background,
      },
    })}
  />
)

export default LayoutManager
