import React, { FC } from "react"
import { Button, Flex } from "theme-ui"

import Typography from "../Typography/Typography"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

interface Props {
  onCancel?: () => void
  onCancelText?: string
  onAccept?: () => void
  onAcceptText: string
  title: string
  loading?: boolean
}
export const DialogHeader: FC<Props> = ({
  title,
  onAccept,
  onAcceptText,
  onCancel,
  onCancelText = "Cancel",
  loading,
}) => (
  <Flex
    backgroundColor="surface"
    py={1}
    sx={{
      alignItems: "center",
      position: "relative",
    }}
  >
    <Typography.H6
      sx={{
        width: "100%",
        position: "absolute",
        pointerEvents: "none",
        textAlign: "center",
        alignContent: "center",
      }}
    >
      {title}
    </Typography.H6>
    <Button variant="secondary" color="danger" my={1} onClick={onCancel} ml={2}>
      {onCancelText}
    </Button>
    <Button variant="secondary" ml="auto" my={1} onClick={onAccept} mr={2}>
      {loading && <LoadingIndicator />} {onAcceptText}
    </Button>
  </Flex>
)

export default DialogHeader
