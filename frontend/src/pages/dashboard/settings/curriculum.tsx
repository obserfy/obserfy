import React, { FC, useContext } from "react"
import SEO from "../../../components/seo"
import { PageTitleContext } from "../../../layouts"
import PageCurriculumSettings from "../../../components/PageCurriculumSettings/PageCurriculumSettings"

const Settings: FC = () => {
  useContext(PageTitleContext).setTitle("Curriculum")

  return (
    <>
      <SEO title="Settings" />
      <PageCurriculumSettings />
    </>
  )
}

export default Settings
