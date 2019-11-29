import React, { FC } from "react"
import { Flex } from "../Flex/Flex"
import { Typography } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import Spacer from "../Spacer/Spacer"
import Button from "../Button/Button"
import Dialog from "../Dialog/Dialog"
import Box, { BoxProps } from "../Box/Box"

interface Props extends BoxProps {
  title: string
  negativeText: string
  positiveText: string
  onDismiss?: () => void
  onNegativeClick?: () => void
  onPositiveClick?: () => void
  subtext?: string
  disablePositiveButton?: boolean
}
export const ScrollableDialog: FC<Props> = ({
  positiveText,
  negativeText,
  onPositiveClick,
  onDismiss,
  title,
  onNegativeClick,
  children,
  subtext,
  disablePositiveButton,
  ...props
}) => (
  <Dialog {...props}>
    <Flex flexDirection="column" maxHeight="100%">
      <Flex
        alignItems="center"
        p={3}
        sx={{
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor: "border"
        }}
      >
        <Typography.H6
          mb={0}
          mr={3}
          fontWeight="bold"
          flex={1}
          overflowY="auto"
        >
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
      <Box overflowY="auto" backgroundColor="background">
        {children}
      </Box>
      <Flex
        p={3}
        alignItems="center"
        sx={{
          borderTopWidth: 1,
          borderTopStyle: "solid",
          borderTopColor: "border"
        }}
      >
        <Typography.Body mb={0} color="textMediumEmphasis">
          {subtext}
        </Typography.Body>
        <Spacer />
        <Button mr={3} variant="outline" onClick={onNegativeClick}>
          {negativeText}
        </Button>
        <Button variant="primary" onClick={onPositiveClick} disabled={disablePositiveButton}>
          {positiveText}
        </Button>
      </Flex>
    </Flex>
  </Dialog>
)

export default ScrollableDialog
