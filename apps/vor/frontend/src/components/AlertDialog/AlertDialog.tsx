import React, { FC } from "react"
import Dialog from "../Dialog/Dialog"
import { Typography } from "../Typography/Typography"
import { BoxProps } from "../Box/Box"
import DialogHeader from "../DialogHeader/DialogHeader"

interface Props extends BoxProps {
  title: string
  negativeText: string
  positiveText: string
  onDismiss?: () => void
  onNegativeClick?: () => void
  onPositiveClick?: () => void
  body: string
}
export const AlertDialog: FC<Props> = ({
  positiveText,
  negativeText,
  onPositiveClick,
  onDismiss,
  title,
  body,
  onNegativeClick,
  ...props
}) => (
  <Dialog {...props}>
    <DialogHeader
      title={title}
      onAcceptText={positiveText}
      onCancelText={negativeText}
      onCancel={onNegativeClick}
      onAccept={onPositiveClick}
    />
    <Typography.Body p={3} m={0} backgroundColor="background">
      {body}
    </Typography.Body>
  </Dialog>
)

export default AlertDialog
