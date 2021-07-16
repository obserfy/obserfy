import { t } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { FC, useState } from "react"
import { Box } from "theme-ui"
import usePostNewCurriculum from "../../hooks/api/curriculum/usePostNewCurriculum"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"

export interface NewCustomCurriculumDialogProps {
  onDismiss: () => void
}
const NewCustomCurriculumDialog: FC<NewCustomCurriculumDialogProps> = ({
  onDismiss,
}) => {
  const postNewCurriculum = usePostNewCurriculum()
  const [name, setName] = useState("")
  const { i18n } = useLingui()

  return (
    <Dialog>
      <DialogHeader
        title={i18n._(t`Custom Curriculum`)}
        onCancel={onDismiss}
        loading={postNewCurriculum.isLoading}
        onAccept={async () => {
          try {
            await postNewCurriculum.mutateAsync({ template: "custom", name })
            onDismiss()
          } catch (e) {
            Sentry.captureException(e)
          }
        }}
      />
      <Box p={3} sx={{ backgroundColor: "background" }}>
        <Input
          label={i18n._(t`Curriculum Name`)}
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ width: "100%" }}
          placeholder={i18n._(t`Choose a Name`)}
        />
      </Box>
    </Dialog>
  )
}

export default NewCustomCurriculumDialog
