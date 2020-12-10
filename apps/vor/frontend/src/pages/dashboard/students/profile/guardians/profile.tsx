import { t } from "@lingui/macro"
import React from "react"
import { Box } from "theme-ui"
import { useGetStudent } from "../../../../../api/useGetStudent"
import PageGuardianProfile from "../../../../../components/PageGuardianProfile/PageGuardianProfile"
import TopBar, { breadCrumb } from "../../../../../components/TopBar/TopBar"
import { getFirstName } from "../../../../../domain/person"
import { useQueryString } from "../../../../../hooks/useQueryString"
import {
  STUDENT_OVERVIEW_PAGE_URL,
  STUDENT_PROFILE_URL,
  STUDENTS_URL,
} from "../../../../../routes"

const GuardianProfile = () => {
  const guardianId = useQueryString("guardianId")
  const studentId = useQueryString("studentId")

  const { data: student } = useGetStudent(studentId)

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <TopBar
        breadcrumbs={[
          breadCrumb(t`Students`, STUDENTS_URL),
          breadCrumb(
            getFirstName(student),
            STUDENT_OVERVIEW_PAGE_URL(studentId)
          ),
          breadCrumb(t`Profile`, STUDENT_PROFILE_URL(studentId)),
          breadCrumb(t`Guardian Profile`),
        ]}
      />
      <PageGuardianProfile guardianId={guardianId} />
    </Box>
  )
}

export default GuardianProfile
