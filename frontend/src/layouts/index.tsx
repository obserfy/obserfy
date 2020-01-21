import React, { FC, useState } from "react"
import Layout from "../components/Layout/Layout"
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary"

export const PageTitleContext = React.createContext({
  title: "",
  setTitle: (title: string) => {},
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LayoutManager: FC<any> = ({ children, pageContext }) => {
  const [title, setTitle] = useState("Home")
  if (pageContext.layout === "open") {
    return children
  }
  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      <ErrorBoundary title={title}>
        <Layout pageTitle={title}>{children}</Layout>
      </ErrorBoundary>
    </PageTitleContext.Provider>
  )
}

export default LayoutManager
