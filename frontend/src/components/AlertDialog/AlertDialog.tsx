import React, { FC } from "react"
import { Flex } from "../Flex/Flex"
import Dialog from "../Dialog/Dialog"
import { Typography } from "../Typography/Typography"
import Spacer from "../Spacer/Spacer"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import { BoxProps } from "../Box/Box"

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
    <Flex
      alignItems="center"
      p={3}
      sx={{
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "border"
      }}
    >
      <Typography.H6 mb={0} mr={3} fontWeight="bold" flex={1}>
        {title}
      </Typography.H6>
      <Icon
        as={CloseIcon}
        size={32}
        m={0}
        onClick={onDismiss}
        sx={{ cursor: "pointer" }}
      />
    </Flex>
    <Typography.Body p={3} m={0}>
      {body}
    </Typography.Body>
    <Flex
      p={3}
      sx={{
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: "border"
      }}
    >
      <Spacer />
      <Button mr={3} variant="outline" onClick={onNegativeClick}>
        {negativeText}
      </Button>
      <Button variant="primary" onClick={onPositiveClick}>
        {positiveText}
      </Button>
    </Flex>
  </Dialog>
)

export default AlertDialog
