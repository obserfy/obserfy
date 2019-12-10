import React, { FC, useContext } from "react"
import PageSettings from "../components/PageSettings/PageSettings"
import SEO from "../components/seo"
import { PageTitleContext } from "../layouts"

const Settings: FC = () => {
  const pageTitle = useContext(PageTitleContext)
  pageTitle.setTitle("Settings")

  return (
    <>
      <SEO title="Settings" />
      <PageSettings />
    </>
  )
}

export default Settings
