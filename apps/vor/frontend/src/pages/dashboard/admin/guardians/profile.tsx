import { t } from "@lingui/macro"

import { Box, Button } from "theme-ui"
import AlertDialog from "../../../../components/AlertDialog/AlertDialog"
import { navigate } from "../../../../components/Link/Link"
import PageGuardianProfile from "../../../../components/PageGuardianProfile/PageGuardianProfile"
import TopBar, { breadCrumb } from "../../../../components/TopBar/TopBar"
import { getFirstName } from "../../../../domain/person"
import useDeleteGuardian from "../../../../hooks/api/guardians/useDeleteGuardian"
import { useGetGuardian } from "../../../../hooks/api/guardians/useGetGuardian"
import { useQueryString } from "../../../../hooks/useQueryString"
import useVisibilityState from "../../../../hooks/useVisibilityState"
import { ADMIN_GUARDIAN_URL, ADMIN_URL } from "../../../../routes"

const GuardianProfile = () => {
  const id = useQueryString("id")
  const deleteGuardian = useDeleteGuardian(id)
  const deleteDialog = useVisibilityState()
  const { data } = useGetGuardian(id)

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <TopBar
        breadcrumbs={[
          breadCrumb(t`Admin`, ADMIN_URL),
          breadCrumb(t`All Guardians`, ADMIN_GUARDIAN_URL),
          breadCrumb(getFirstName(data)),
        ]}
      />
      <PageGuardianProfile guardianId={id} />
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
              navigate(ADMIN_GUARDIAN_URL)
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
