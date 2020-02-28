import React, { FC } from "react"
import SEO from "../../../../components/seo"
import PageCurriculumSettings from "../../../../components/PageCurriculumSettings/PageCurriculumSettings"
import { useTitle } from "../../../../hooks/useTitle"

const Settings: FC = () => {
  useTitle("Curriculum")

  return (
    <>
      <SEO title="Settings" />
      <PageCurriculumSettings />
    </>
  )
}

export default Settings
