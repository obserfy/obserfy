import { t } from "@lingui/macro"
import React from "react"
import { Box, Flex } from "theme-ui"
import PageCurriculumArea from "../../../../../components/PageCurriculumArea/PageCurriculumArea"
import PageCurriculumSettings from "../../../../../components/PageCurriculumSettings/PageCurriculumSettings"
import PageCurriculumSubject from "../../../../../components/PageCurriculumSubject/PageCurriculumSubject"
import SEO from "../../../../../components/seo"
import { useQueryString } from "../../../../../hooks/useQueryString"

const Subject = () => {
  const areaId = useQueryString("areaId")
  const subjectId = useQueryString("subjectId")

  return (
    <Box>
      <SEO title={t`Subject`} />
      <Flex>
        <Box
          sx={{
            width: "100%",
            maxWidth: ["100%", "100%", 340],
            display: ["none", "none", "block"],
          }}
        >
          <PageCurriculumSettings />
        </Box>
        <Box
          sx={{
            width: "100%",
            maxWidth: ["100%", "100%", 340],
            display: ["none", "none", "block"],
          }}
        >
          <PageCurriculumArea id={areaId} />
        </Box>

        <PageCurriculumSubject subjectId={subjectId} areaId={areaId} />
      </Flex>
    </Box>
  )
}

export default Subject
