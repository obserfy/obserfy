import { t } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { FC, useState } from "react"
import { Box } from "theme-ui"
import usePostNewArea from "../../hooks/api/curriculum/usePostNewArea"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import Typography from "../Typography/Typography"

interface Props {
  curriculumId: string
  onDismiss: () => void
}
export const NewAreaDialog: FC<Props> = ({ onDismiss, curriculumId }) => {
  const [name, setName] = useState("")
  const postNewArea = usePostNewArea(curriculumId)
  const { i18n } = useLingui()

  return (
    <Dialog sx={{ backgroundColor: "background" }}>
      <DialogHeader
        title={t`New Area`}
        onCancel={onDismiss}
        onAccept={async () => {
          try {
            await postNewArea.mutateAsync({ name })
            onDismiss()
          } catch (e) {
            Sentry.captureException(e)
          }
        }}
      />
      <Box px={3} pb={4} pt={3}>
        {postNewArea.isError && <ErrorMessage />}
        <Input
          disabled={postNewArea.isLoading}
          autoFocus
          label={t`Area name`}
          sx={{ width: "100%" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={i18n._(t`Ex. Mathematics`)}
        />
      </Box>
    </Dialog>
  )
}

const ErrorMessage: FC = () => (
  <Typography.Body
    color="warning"
    mb={2}
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

export default NewAreaDialog
