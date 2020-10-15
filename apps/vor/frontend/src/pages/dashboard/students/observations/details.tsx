import React, { FC } from "react"
import { Box } from "theme-ui"
import { t } from "@lingui/macro"
import SEO from "../../../../components/seo"
import { useQueryString } from "../../../../hooks/useQueryString"
import PageObservationDetails from "../../../../components/PageObservationDetails/PageObservationDetails"
import TopBar from "../../../../components/TopBar/TopBar"
import {
  ALL_OBSERVATIONS_PAGE_URL,
  STUDENT_OVERVIEW_PAGE_URL,
  STUDENTS_URL,
} from "../../../../routes"
import { useGetStudent } from "../../../../api/useGetStudent"

const ObservationDetails: FC = () => {
  const studentId = useQueryString("studentId")
  const observationId = useQueryString("observationId")

  const student = useGetStudent(studentId)

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
      <SEO title="Edit Student" />
      <TopBar
        breadcrumbs={[
          { to: STUDENTS_URL, text: t`Students` },
          {
            to: STUDENT_OVERVIEW_PAGE_URL(studentId),
            text: student.data?.name?.split(" ")[0] ?? "",
          },
          {
            to: ALL_OBSERVATIONS_PAGE_URL(studentId),
            text: t`Observations`,
          },
          { text: t`Details` },
        ]}
      />
      <PageObservationDetails
        studentId={studentId}
        observationId={observationId}
        backUrl={ALL_OBSERVATIONS_PAGE_URL(studentId)}
      />
    </Box>
  )
}
export default ObservationDetails
