import { t } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Card } from "theme-ui"
import { useGetSchool } from "../../hooks/api/schools/useGetSchool"
import usePatchSchool from "../../hooks/api/schools/usePatchSchool"
import { getSchoolId } from "../../hooks/schoolIdState"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ADMIN_URL } from "../../routes"
import DataBox from "../DataBox/DataBox"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import Typography from "../Typography/Typography"

export interface PageSchoolProfileProps {}
const PageSchoolProfile: FC<PageSchoolProfileProps> = () => {
  const school = useGetSchool()

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
      <TopBar
        breadcrumbs={[
          breadCrumb("Admin", ADMIN_URL),
          breadCrumb("School Profile"),
        ]}
      />

      <Box m={3}>
        <Typography.H5>School Profile</Typography.H5>
      </Box>

      <Card variant="responsive">
        <NameDataBox originalValue={school.data?.name} />
      </Card>
    </Box>
  )
}

const NameDataBox: FC<{ originalValue?: string }> = ({
  originalValue = "",
}) => {
  const editDialog = useVisibilityState()

  return (
    <>
      <DataBox
        label={t`School name`}
        value={originalValue}
        onEditClick={editDialog.show}
      />

      {editDialog.visible && (
        <EditNameDialog
          originalValue={originalValue}
          onDismiss={editDialog.hide}
        />
      )}
    </>
  )
}

const EditNameDialog: FC<{ originalValue: string; onDismiss: () => void }> = ({
  originalValue,
  onDismiss,
}) => {
  const [value, setValue] = useState(originalValue)
  const patchSchool = usePatchSchool(getSchoolId())

  const handleSave = () => {
    try {
      patchSchool.mutate({ name: value })
      onDismiss()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Dialog>
      <DialogHeader
        title={t`Edit School Name`}
        onCancel={onDismiss}
        onAccept={handleSave}
      />

      <Box px={3} pt={2} pb={3} sx={{ backgroundColor: "background" }}>
        <Input
          label={t`Name`}
          sx={{ width: "100%" }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Box>
    </Dialog>
  )
}

export default PageSchoolProfile
