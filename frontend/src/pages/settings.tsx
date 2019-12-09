import React, { FC } from "react"
import PageSettings from "../components/PageSettings/PageSettings"
import Layout from "../components/Layout/Layout"
import SEO from "../components/seo"

const Settings: FC = () => (
  <Layout pageTitle="Settings">
    <SEO title="Settings" />
    <PageSettings />
  </Layout>
)

export default Settings
