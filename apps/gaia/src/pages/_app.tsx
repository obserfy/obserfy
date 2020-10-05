import React from "react"
import { AppComponent } from "next/dist/next-server/lib/router/router"
import Layout from "../components/layout"
import "../global.css"
import ErrorBoundary from "../components/ErrorBoundary"

const App: AppComponent = ({ Component, pageProps }) => {
  return (
    <ErrorBoundary>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ErrorBoundary>
  )
}

export default App
