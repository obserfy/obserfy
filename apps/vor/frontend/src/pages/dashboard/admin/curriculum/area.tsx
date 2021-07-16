import { t } from "@lingui/macro"
import { useBreakpointIndex } from "@theme-ui/match-media"
import { PageRendererProps } from "gatsby"
import { FC } from "react"
import { Box, Flex } from "theme-ui"
import CurriculumTopBar from "../../../../components/CurriculumTopBar/CurriculumTopBar"
import PageCurriculumArea from "../../../../components/PageCurriculumArea/PageCurriculumArea"
import PageCurriculumSettings from "../../../../components/PageCurriculumSettings/PageCurriculumSettings"
import SEO from "../../../../components/seo"
import { breadCrumb } from "../../../../components/TopBar/TopBar"
import { useGetArea } from "../../../../hooks/api/useGetArea"
import { useQueryString } from "../../../../hooks/useQueryString"
import { ADMIN_CURRICULUM_URL, ADMIN_URL } from "../../../../routes"

const Area: FC<PageRendererProps> = () => {
  const areaId = useQueryString("areaId")

  const area = useGetArea(areaId)

  return (
    <>
      <SEO title={t`Areas`} />
      <Box>
        <CurriculumTopBar
          breadcrumbs={[
            breadCrumb("Admin", ADMIN_URL),
            breadCrumb("Curriculum", ADMIN_CURRICULUM_URL),
            breadCrumb(`${area.data?.name}`),
          ]}
        />
        <Flex>
          <SideBar />
          <PageCurriculumArea id={areaId} />
        </Flex>
      </Box>
    </>
  )
}

const SideBar = () => {
  const breakpoint = useBreakpointIndex({ defaultIndex: 3 })

  if (breakpoint < 2) return <></>

  return <PageCurriculumSettings sx={{ display: ["none", "none", "block"] }} />
}

export default Area
