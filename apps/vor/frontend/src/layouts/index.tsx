import { Global } from "@emotion/react"
import React, { FC } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { Box, useColorMode } from "theme-ui"
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary"
import Layout from "../components/Layout/Layout"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // refetchOnMount and refetchOnWindowFocus causes prefresh to fail and reload every once in a while.
      refetchOnMount: process.env.NODE_ENV !== "development",
      refetchOnWindowFocus: process.env.NODE_ENV !== "development",
    },
  },
})

// Used by gatsby-plugin-layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LayoutManager: FC<any> = ({ children, pageContext }) => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <GlobalStyle />
      {pageContext.layout === "open" ? (
        <Box sx={{ backgroundColor: "background" }}>{children}</Box>
      ) : (
        <Layout>{children}</Layout>
      )}
    </ErrorBoundary>
  </QueryClientProvider>
)

const GlobalStyle: FC = () => {
  const [mode] = useColorMode()

  return (
    <Global
      styles={({ colors }) => ({
        body: {
          backgroundColor: colors.background,
          minHeight: "100vh",
          top: 0,
          scrollbarColor: "dark",
        },
        "::-webkit-scrollbar":
          mode !== "dark"
            ? {}
            : { width: 8, backgroundColor: colors.background },
        "::-webkit-scrollbar-thumb":
          mode !== "dark"
            ? {}
            : { backgroundColor: colors.surface, borderRadius: 9999 },
      })}
    />
  )
}

export default LayoutManager
