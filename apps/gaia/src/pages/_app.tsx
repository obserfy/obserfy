import React from "react"
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactQueryDevtools } from "react-query-devtools"
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
      <ReactQueryDevtools initialIsOpen={false} />
    </ErrorBoundary>
  )
}

export default App
