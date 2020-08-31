import React from "react"
import Layout from "../components/layout"
import "../global.css"
import ErrorBoundary from "../components/ErrorBoundary"

function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ErrorBoundary>
  )
}

export default App
