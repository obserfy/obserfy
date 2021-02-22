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
  const customScroll = mode === "dark"

  return (
    <Global
      styles={({ colors }) => ({
        body: {
          backgroundColor: colors.background,
          minHeight: "100vh",
          top: 0,
          scrollbarColor: "dark",
        },
        "::-webkit-scrollbar": customScroll
          ? {}
          : { width: 8, backgroundColor: "#1c1c1c" },
        "::-webkit-scrollbar-thumb": customScroll
          ? {}
          : { backgroundColor: "#3e3e3e", borderRadius: 9999 },
      })}
    />
  )
}

export default LayoutManager
