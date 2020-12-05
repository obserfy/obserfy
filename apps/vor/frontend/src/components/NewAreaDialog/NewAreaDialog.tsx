import React, { FC, useState } from "react"
import { Box } from "theme-ui"
import { t } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import Dialog from "../Dialog/Dialog"
import Input from "../Input/Input"
import Typography from "../Typography/Typography"
import usePostNewArea from "../../api/curriculum/usePostNewArea"
import DialogHeader from "../DialogHeader/DialogHeader"

interface Props {
  curriculumId: string
  onDismiss: () => void
}
export const NewAreaDialog: FC<Props> = ({ onDismiss, curriculumId }) => {
  const [name, setName] = useState("")
  const [postNewArea, { isLoading, isError }] = usePostNewArea(curriculumId)
  const { i18n } = useLingui()

  return (
    <Dialog sx={{ backgroundColor: "background" }}>
      <DialogHeader
        title={t`New Area`}
        onCancel={onDismiss}
        onAccept={async () => {
          const response = await postNewArea({ name })
          if (response?.ok) {
            onDismiss()
          }
        }}
      />
      <Box px={3} pb={4} pt={3}>
        {isError && <ErrorMessage />}
        <Input
          disabled={isLoading}
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
