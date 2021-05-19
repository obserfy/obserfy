import { Trans } from "@lingui/macro"
import React, { FC } from "react"
import { Box, Card } from "theme-ui"
import { useGetCurriculumAreas } from "../../hooks/api/useGetCurriculumAreas"
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
  const observations = useGetStudentObservations(studentId)
  const areas = useGetCurriculumAreas()

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TranslucentBar boxSx={{ position: "sticky", top: 0, height: 44 }}>
        <Tab
          items={areas.data?.map((area) => area.name) ?? []}
          selectedItemIdx={0}
          onTabClick={() => {}}
        />
      </TranslucentBar>

      <Box
        p={3}
        sx={{
          display: ["block", "block", "block", "flex"],
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            width: "100%",
            position: [undefined, "sticky"],
            top: 0,
            zIndex: 10,
          }}
          pr={[0, 0, 0, 3]}
          pb={3}
        >
          <Typography.H6 sx={{ fontWeight: "bold" }} py={3} pb={3}>
            <Trans>Evaluation</Trans>
          </Typography.H6>
          <Card>
            <MarkdownEditor onChange={() => {}} value="" />
          </Card>
        </Box>

        <Box sx={{ width: ["auto", "auto", "auto", 600] }} pt={3}>
          <Typography.H6 sx={{ fontWeight: "bold" }} mb={3}>
            <Trans>Observations</Trans>
          </Typography.H6>
          {observations.data?.map((observation) => (
            <Card key={observation.id} mb={3}>
              <ObservationListItem
                observation={observation}
                detailsUrl=""
                studentId={studentId}
                containerSx={{ borderBottom: "none" }}
              />
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default PageStudentReport
