import React, { FC } from "react"
import { Global } from "@emotion/react"
import { QueryClient, QueryClientProvider } from "react-query"
import { Box } from "theme-ui"
import Layout from "../components/Layout/Layout"
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary"

const queryClient = new QueryClient()

// Used by gatsby-plugin-layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LayoutManager: FC<any> = ({ children, pageContext }) => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      {pageContext.layout === "open" ? (
        <Box sx={{ backgroundColor: "background" }}>{children}</Box>
      ) : (
        <Layout>{children}</Layout>
      )}
    </QueryClientProvider>
  </ErrorBoundary>
)

const GlobalStyle: FC = () => (
  <Global
    styles={(theme) => ({
      body: {
        backgroundColor: theme.colors?.background ?? "",
        minHeight: "100vh",
        top: 0,
      },
    })}
  />
)

export default LayoutManager
