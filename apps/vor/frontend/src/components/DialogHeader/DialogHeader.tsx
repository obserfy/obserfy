import React, { FC } from "react"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import Flex from "../Flex/Flex"

interface Props {
  onCancel: () => void
  onCancelText?: string
  onAccept: () => void
  onAcceptText: string
  title: string
}
export const DialogHeader: FC<Props> = ({
  title,
  onAccept,
  onAcceptText,
  onCancel,
  onCancelText = "Cancel",
}) => (
  <Flex
    alignItems="center"
    backgroundColor="surface"
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
    <Button variant="secondary" color="danger" my={1} onClick={onCancel}>
      {onCancelText}
    </Button>
    <Button variant="secondary" ml="auto" my={1} onClick={onAccept}>
      {onAcceptText}
    </Button>
  </Flex>
)

export default DialogHeader
