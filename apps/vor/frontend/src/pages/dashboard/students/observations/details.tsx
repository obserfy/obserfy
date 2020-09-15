import React, { FC } from "react"
import { Box } from "theme-ui"
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
    <Box mx="auto" sx={{ maxWidth: "maxWidth.tm" }}>
      <SEO title="Edit Student" />
      <TopBar
        breadcrumbs={[
          { to: STUDENTS_URL, text: "Students" },
          {
            to: STUDENT_OVERVIEW_PAGE_URL(studentId),
            text: student.data?.name?.split(" ")[0],
          },
          {
            to: ALL_OBSERVATIONS_PAGE_URL(studentId),
            text: "Observations",
          },
          { text: "Details" },
        ]}
      />
      <PageObservationDetails observationId={observationId} />
    </Box>
  )
}
export default ObservationDetails
