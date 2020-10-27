import React, { FC } from "react"
import { BoxProps } from "theme-ui"
import { Trans } from "@lingui/macro"
import Dialog from "../Dialog/Dialog"
import { Typography } from "../Typography/Typography"
import DialogHeader from "../DialogHeader/DialogHeader"

interface Props extends BoxProps {
  title: string
  negativeText?: string
  positiveText: string
  onDismiss?: () => void
  onNegativeClick?: () => void
  onPositiveClick?: () => void
  body: string
  loading?: boolean
}
export const AlertDialog: FC<Props> = ({
  positiveText,
  negativeText,
  onPositiveClick,
  onDismiss,
  title,
  body,
  onNegativeClick,
  loading,
  ...props
}) => (
  <Dialog {...props}>
    <DialogHeader
      title={title}
      onAcceptText={positiveText}
      onCancelText={negativeText}
      onCancel={onNegativeClick}
      onAccept={onPositiveClick}
      loading={loading}
    />
    <Typography.Body p={3} sx={{ backgroundColor: "background" }}>
      <Trans id={body} />
    </Typography.Body>
  </Dialog>
)

export default AlertDialog
