import { t } from "@lingui/macro"
import React, { FC } from "react"
import { Box } from "theme-ui"
import SEO from "../../../../components/seo"
import PageCurriculumSettings from "../../../../components/PageCurriculumSettings/PageCurriculumSettings"

const Settings: FC = () => (
  <>
    <SEO title={t`Curriculum`} />
    <Box
      sx={{
        width: "100%",
        maxWidth: ["100%", "100%", 280],
      }}
    >
      <PageCurriculumSettings />
    </Box>
  </>
)

export default Settings
