import React, { FC } from "react"
import PageSettings from "../../../components/PageSettings/PageSettings"
import SEO from "../../../components/seo"
import { useTitle } from "../../../hooks/useTitle"

const Settings: FC = () => {
  useTitle("Settings")

  return (
    <>
      <SEO title="Settings" />
      <PageSettings />
    </>
  )
}

export default Settings
