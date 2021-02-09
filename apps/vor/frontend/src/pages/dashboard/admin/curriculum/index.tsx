import { t } from "@lingui/macro"
import React, { FC } from "react"
import PageCurriculumSettings from "../../../../components/PageCurriculumSettings/PageCurriculumSettings"
import SEO from "../../../../components/seo"

const Settings: FC = () => (
  <>
    <SEO title={t`Curriculum`} />
    <PageCurriculumSettings />
  </>
)

export default Settings
