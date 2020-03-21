import React, { FC } from "react"
import SEO from "../../../../components/seo"
import PageClassSettings from "../../../../components/PageClassSettings/PageClassSettings"

export const CLASS_SETTINGS_URL = "/dashboard/settings/class"

const Class: FC = () => {
  return (
    <>
      <SEO title="Class" />
      <PageClassSettings />
    </>
  )
}

export default Class
