import { t } from "@lingui/macro"
import { useBreakpointIndex } from "@theme-ui/match-media"
import React, { FC } from "react"
import { Box, Flex } from "theme-ui"
import CurriculumTopBar from "../../../../../components/CurriculumTopBar/CurriculumTopBar"
import PageCurriculumArea from "../../../../../components/PageCurriculumArea/PageCurriculumArea"
import PageCurriculumMaterial from "../../../../../components/PageCurriculumMaterial/PageCurriculumMaterial"
import PageCurriculumSettings from "../../../../../components/PageCurriculumSettings/PageCurriculumSettings"
import SEO from "../../../../../components/seo"
import { breadCrumb } from "../../../../../components/TopBar/TopBar"
import { useGetArea } from "../../../../../hooks/api/useGetArea"
import { useGetSubject } from "../../../../../hooks/api/useGetSubject"
import { useQueryString } from "../../../../../hooks/useQueryString"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_URL,
  CURRICULUM_AREA_URL,
} from "../../../../../routes"

const Material = () => {
  const areaId = useQueryString("areaId")
  const subjectId = useQueryString("subjectId")

  const area = useGetArea(areaId)
  const subject = useGetSubject(subjectId)

  return (
    <Box>
      <SEO title={t`Material`} />

      <CurriculumTopBar
        breadcrumbs={[
          breadCrumb("Admin", ADMIN_URL),
          breadCrumb("Curriculum", ADMIN_CURRICULUM_URL),
          breadCrumb(area.data?.name ?? "", CURRICULUM_AREA_URL(areaId)),
          breadCrumb(subject.data?.name ?? ""),
        ]}
      />

      <Flex>
        <SideBar areaId={areaId} />
        <PageCurriculumMaterial />
      </Flex>
    </Box>
  )
}

const SideBar: FC<{ areaId: string }> = ({ areaId }) => {
  const breakpoint = useBreakpointIndex({ defaultIndex: 3 })

  if (breakpoint < 2) return <></>

  return (
    <>
      <PageCurriculumSettings sx={{ display: ["none", "none", "block"] }} />
      <PageCurriculumArea
        id={areaId}
        sx={{ display: ["none", "none", "block"] }}
      />
    </>
  )
}

export default Material
