import React, { FC } from "react"
import { Box } from "theme-ui"
import SEO from "../../../components/seo"
import { useQueryString } from "../../../hooks/useQueryString"
import PageObservationDetails from "../../../components/PageObservationDetails/PageObservationDetails"
import TopBar from "../../../components/TopBar/TopBar"
import { STUDENT_OVERVIEW_PAGE_URL, STUDENTS_URL } from "../../../routes"
import { useGetStudent } from "../../../api/useGetStudent"

// TODO: this page is a temporary hack, replace with proper solution that doesn't requires duplicating page plz.
// This is the same with the ./observation/details.tsx with a difference in the breadcrumb.
// This page is higher on the navigation tree, used by observations on student overview page.
// The breadcrumb goes back to StudentOverview directly, not to
// all observation page (which is what the ./observation/details.tsx does)
const ObservationDetails: FC = () => {
  const studentId = useQueryString("studentId")
  const observationId = useQueryString("observationId")

  const student = useGetStudent(studentId)

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
      <SEO title="Edit Student" />
      <TopBar
        breadcrumbs={[
          { to: STUDENTS_URL, text: "Students" },
          {
            to: STUDENT_OVERVIEW_PAGE_URL(studentId),
            text: student.data?.name?.split(" ")[0],
          },
          { text: "Observations Details" },
        ]}
      />
      <PageObservationDetails
        observationId={observationId}
        backUrl={STUDENT_OVERVIEW_PAGE_URL(studentId)}
      />
    </Box>
  )
}

export default ObservationDetails
