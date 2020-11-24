import React, { FC, useState } from "react"
import { Box } from "theme-ui"
import { t } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import Dialog from "../Dialog/Dialog"
import { GuardianRelationship } from "../../api/students/usePostNewStudent"
import Select from "../Select/Select"
import DialogHeader from "../DialogHeader/DialogHeader"

interface Props {
  onDismiss: () => void
  onAccept: (newRelationship: GuardianRelationship) => void
  defaultValue?: GuardianRelationship
  loading?: boolean
}
export const GuardianRelationshipPickerDialog: FC<Props> = ({
  onDismiss,
  onAccept,
  defaultValue,
  loading,
}) => {
  const [relationship, setRelationship] = useState(
    defaultValue ?? GuardianRelationship.Other
  )
  const { i18n } = useLingui()

  return (
    <Dialog>
      <DialogHeader
        onCancel={onDismiss}
        onAccept={() => onAccept(relationship)}
        onAcceptText="Save"
        title="Relationship"
        loading={loading}
      />

      <Box
        sx={{
          backgroundColor: "background",
        }}
        p={3}
      >
        <Select
          label="Relationship"
          mb={2}
          onChange={(e) => setRelationship(parseInt(e.target.value, 10))}
          value={relationship}
        >
          <option value={GuardianRelationship.Other}>{i18n._(t`Other`)}</option>
          <option value={GuardianRelationship.Mother}>
            {i18n._(t`Mother`)}
          </option>
          <option value={GuardianRelationship.Father}>
            {i18n._(t`Father`)}
          </option>
        </Select>
      </Box>
    </Dialog>
  )
}

export default GuardianRelationshipPickerDialog
