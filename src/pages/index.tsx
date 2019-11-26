import React from "react"
import { Link } from "gatsby"
import Layout from "../components/Layout/Layout"
import Typography from "../components/Typography/Typography"

const IndexPage = () => (
  <Layout pageTitle="home">
    <Typography.Body>
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>Test</div>
      <Link to="/page-2/">Go to page 2</Link>
    </Typography.Body>
  </Layout>
)

export default IndexPage
