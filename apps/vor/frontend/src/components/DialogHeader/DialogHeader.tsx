import React, { FC } from "react"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import Flex from "../Flex/Flex"
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
    alignItems="center"
    backgroundColor="surface"
    py={1}
    sx={{
      position: "relative",
      borderBottomColor: "border",
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
    }}
  >
    <Typography.H6
      width="100%"
      sx={{
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
