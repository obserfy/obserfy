import { t } from "@lingui/macro"
import { useBreakpointIndex } from "@theme-ui/match-media"
import { FC } from "react"
import { Box, Flex } from "theme-ui"
import { borderRight } from "../../../../../border"
import CurriculumTopBar from "../../../../../components/CurriculumTopBar/CurriculumTopBar"
import PageCurriculumMaterial from "../../../../../components/PageCurriculumMaterial/PageCurriculumMaterial"
import PageCurriculumSubject from "../../../../../components/PageCurriculumSubject/PageCurriculumSubject"
import SEO from "../../../../../components/seo"
import { breadCrumb } from "../../../../../components/TopBar/TopBar"
import useGetMaterial from "../../../../../hooks/api/curriculum/useGetMaterial"
import { useGetArea } from "../../../../../hooks/api/useGetArea"
import { useGetSubject } from "../../../../../hooks/api/useGetSubject"
import { useQueryString } from "../../../../../hooks/useQueryString"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_URL,
  CURRICULUM_AREA_URL,
  CURRICULUM_SUBJECT_URL,
} from "../../../../../routes"

const Material = () => {
  const areaId = useQueryString("areaId")
  const subjectId = useQueryString("subjectId")
  const materialId = useQueryString("materialId")

  const area = useGetArea(areaId)
  const subject = useGetSubject(subjectId)
  const material = useGetMaterial(materialId)

  return (
    <Box>
      <SEO title={t`Material`} />

      <CurriculumTopBar
        breadcrumbs={[
          breadCrumb("Admin", ADMIN_URL),
          breadCrumb("Curriculum", ADMIN_CURRICULUM_URL),
          breadCrumb(area.data?.name ?? "", CURRICULUM_AREA_URL(areaId)),
          breadCrumb(
            subject.data?.name ?? "",
            CURRICULUM_SUBJECT_URL(areaId, subjectId)
          ),
          breadCrumb(material.data?.name ?? ""),
        ]}
      />

      <Flex>
        <SideBar areaId={areaId} subjectId={subjectId} />
        <PageCurriculumMaterial
          key={materialId}
          areaId={areaId}
          subjectId={subjectId}
          materialId={materialId}
        />
      </Flex>
    </Box>
  )
}

const SideBar: FC<{ areaId: string; subjectId: string }> = ({
  areaId,
  subjectId,
}) => {
  const breakpoint = useBreakpointIndex({ defaultIndex: 3 })

  if (breakpoint < 2) return <></>

  return (
    <PageCurriculumSubject
      subjectId={subjectId}
      areaId={areaId}
      sx={{
        position: "sticky",
        top: 0,
        maxWidth: ["100%", "100%", 300, 400],
        height: ["auto", "auto", "100vh"],
        display: ["none", "none", "block"],
        overflow: "auto",
        pb: 5,
        ...borderRight,
      }}
    />
  )
}

export default Material
