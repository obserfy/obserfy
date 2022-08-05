import { t } from "@lingui/macro"
import { FC } from "react"
import { Box } from "theme-ui"
import CurriculumTopBar from "../../../../components/CurriculumTopBar/CurriculumTopBar"
import PageCurriculumSettings from "../../../../components/PageCurriculumSettings/PageCurriculumSettings"
import SEO from "../../../../components/seo"
import { breadCrumb } from "../../../../components/TopBar/TopBar"
import { ADMIN_URL } from "../../../../routes"

const Curriculum: FC = () => (
  <>
    <SEO title={t`Curriculum`} />
    <Box>
      <CurriculumTopBar
        breadcrumbs={[breadCrumb("Admin", ADMIN_URL), breadCrumb("Curriculum")]}
      />
      <PageCurriculumSettings />
    </Box>
  </>
)

export default Curriculum
