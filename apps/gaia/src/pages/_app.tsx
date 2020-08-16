import React from "react"
import Layout from "../components/layout"
import "../global.css"

function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
