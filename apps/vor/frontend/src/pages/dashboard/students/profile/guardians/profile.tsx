import { t } from "@lingui/macro"

import { Box, Button } from "theme-ui"
import AlertDialog from "../../../../../components/AlertDialog/AlertDialog"
import { navigate } from "../../../../../components/Link/Link"
import useDeleteGuardian from "../../../../../hooks/api/guardians/useDeleteGuardian"
import { useGetStudent } from "../../../../../hooks/api/useGetStudent"
import PageGuardianProfile from "../../../../../components/PageGuardianProfile/PageGuardianProfile"
import TopBar, { breadCrumb } from "../../../../../components/TopBar/TopBar"
import { getFirstName } from "../../../../../domain/person"
import { useQueryString } from "../../../../../hooks/useQueryString"
import useVisibilityState from "../../../../../hooks/useVisibilityState"
import {
  STUDENT_OVERVIEW_URL,
  STUDENT_PROFILE_URL,
  STUDENTS_URL,
} from "../../../../../routes"

const GuardianProfile = () => {
  const guardianId = useQueryString("guardianId")
  const studentId = useQueryString("studentId")

  const { data: student } = useGetStudent(studentId)
  const deleteGuardian = useDeleteGuardian(guardianId)
  const deleteDialog = useVisibilityState()

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <TopBar
        breadcrumbs={[
          breadCrumb(t`Students`, STUDENTS_URL),
          breadCrumb(getFirstName(student), STUDENT_OVERVIEW_URL(studentId)),
          breadCrumb(t`Profile`, STUDENT_PROFILE_URL(studentId)),
          breadCrumb(t`Guardian Profile`),
        ]}
      />
      <PageGuardianProfile guardianId={guardianId} />
      <Button
        mr={3}
        ml="auto"
        variant="outline"
        onClick={deleteDialog.show}
        color="danger"
      >
        Delete
      </Button>
      {deleteDialog.visible && (
        <AlertDialog
          title={t`Delete guardian?`}
          body={t`Are you sure you want to delete this guardian completely?`}
          positiveText={t`Delete`}
          onPositiveClick={async () => {
            try {
              await deleteGuardian.mutateAsync()
              navigate(STUDENT_PROFILE_URL(studentId))
            } catch (e) {
              Sentry.captureException(e)
            }
          }}
          onNegativeClick={deleteDialog.hide}
        />
      )}
    </Box>
  )
}

export default GuardianProfile
