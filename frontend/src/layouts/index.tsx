import React, { FC, useState } from "react"
import { Global } from "@emotion/core"
import Layout from "../components/Layout/Layout"
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary"
import Box from "../components/Box/Box"

export const PageTitleContext = React.createContext({
  title: "",
  setTitle: (title: string) => {},
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LayoutManager: FC<any> = ({ children, pageContext }) => {
  const [title, setTitle] = useState("Home")
  if (pageContext.layout === "open") {
    return (
      <ErrorBoundary title={title}>
        <GlobalStyle />
        <Box backgroundColor="background">{children}</Box>
      </ErrorBoundary>
    )
  }
  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      <GlobalStyle />
      <ErrorBoundary title={title}>
        <Layout pageTitle={title}>{children}</Layout>
      </ErrorBoundary>
    </PageTitleContext.Provider>
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
