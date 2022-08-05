import { t } from "@lingui/macro"
import { FC, useState } from "react"
import { Box } from "theme-ui"
import { updateAreaApi } from "../../hooks/api/updateAreaApi"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import Typography from "../Typography/Typography"

interface Props {
  onDismiss: () => void
  onSaved: () => void
  areaId: string
  originalName: string
}
export const EditAreaDialog: FC<Props> = ({
  onDismiss,
  onSaved,
  areaId,
  originalName,
}) => {
  const [name, setName] = useState(originalName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const isValid = name !== originalName && name !== ""

  async function handleCreateArea(): Promise<void> {
    setLoading(true)
    setError(false)
    try {
      const response = await updateAreaApi(areaId, name)
      setLoading(false)
      if (response.status === 200) {
        onSaved()
      }
    } catch (e) {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <Dialog sx={{ backgroundColor: "background" }}>
      <DialogHeader
        title={t`Edit Area`}
        onCancel={onDismiss}
        onAccept={handleCreateArea}
        disableAccept={!isValid || loading}
        loading={loading}
      />

      <Box px={3} pb={3} pt={2}>
        <Input
          disabled={loading}
          autoFocus
          label="Area name"
          sx={{ width: "100%" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {error && <ErrorMessage />}
      </Box>
    </Dialog>
  )
}

const ErrorMessage: FC = () => (
  <Typography.Body
    color="warning"
    mt={3}
    p={1}
    sx={{
      width: "100%",
      fontSize: 1,
      textAlign: "center",
      borderRadius: "default",
      borderStyle: "solid",
      borderColor: "warning",
      borderWidth: 1,
    }}
  >
    Failed saving area, please try again.
  </Typography.Body>
)

export default EditAreaDialog
