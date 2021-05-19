import { Trans } from "@lingui/macro"
import React, { FC } from "react"
import { Box, Card } from "theme-ui"
import { useGetCurriculumAreas } from "../../hooks/api/useGetCurriculumAreas"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import { useGetStudentMaterialProgress } from "../../hooks/api/useGetStudentMaterialProgress"
import { useGetStudentObservations } from "../../hooks/api/useGetStudentObservations"
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor"
import ObservationListItem from "../ObservationListItem/ObservationListItem"
import Tab from "../Tab/Tab"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import Typography from "../Typography/Typography"

export interface PageStudentReportProps {
  studentId: string
}
const PageStudentReport: FC<PageStudentReportProps> = ({ studentId }) => {
  const student = useGetStudent(studentId)
  const observations = useGetStudentObservations(studentId)
  const areas = useGetCurriculumAreas()
  const progress = useGetStudentMaterialProgress(studentId)

  return (
    <Box sx={{ width: "100%" }}>
      <TranslucentBar boxSx={{ position: "sticky", top: 0 }}>
        <Tab
          items={areas.data?.map((area) => area.name) ?? []}
          selectedItemIdx={0}
          onTabClick={() => {}}
        />
      </TranslucentBar>

      <Box p={3} sx={{ display: ["block", "flex"], width: "100%" }}>
        <Box sx={{ width: "100%" }} pr={[0, 3]} pb={3}>
          <Card>
            <Typography.H6 sx={{ fontWeight: "bold" }} p={3} pb={2}>
              <Trans>Evaluation</Trans>
            </Typography.H6>

            <MarkdownEditor onChange={() => {}} value="" />
          </Card>
        </Box>

        <Box sx={{ maxWidth: 400 }} pt={3}>
          <Typography.H6 sx={{ fontWeight: "bold" }} mb={2}>
            <Trans>Observations</Trans>
          </Typography.H6>
          {observations.data?.map((observation) => (
            <Card key={observation.id} mb={3}>
              <ObservationListItem
                observation={observation}
                detailsUrl=""
                studentId={studentId}
              />
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default PageStudentReport
