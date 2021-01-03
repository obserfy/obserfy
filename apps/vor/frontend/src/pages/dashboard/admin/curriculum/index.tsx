import { t } from "@lingui/macro"
import React, { FC } from "react"
import SEO from "../../../../components/seo"
import PageCurriculumSettings from "../../../../components/PageCurriculumSettings/PageCurriculumSettings"

const Settings: FC = () => {
  return (
    <>
      <SEO title={t`Curriculum`} />
      <PageCurriculumSettings />
    </>
  )
}

export default Settings
