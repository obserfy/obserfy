import React, { FC } from "react"
import { Button, Flex, BoxProps, Box } from "theme-ui"
import { Typography } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import Spacer from "../Spacer/Spacer"
import Dialog from "../Dialog/Dialog"

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
    <Flex sx={{ flexDirection: "column", maxHeight: "100%" }}>
      <Flex
        p={3}
        sx={{
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor: "border",
        }}
      >
        <Typography.H6
          mb={0}
          mr={3}
          sx={{
            flex: 1,
            overflowY: "auto",
            fontWeight: "bold",
          }}
        >
          {title}
        </Typography.H6>
        <Icon as={CloseIcon} onClick={onDismiss} sx={{ cursor: "pointer" }} />
      </Flex>
      <Box sx={{ overflowY: "auto", backgroundColor: "background" }}>
        {children}
      </Box>
      <Flex
        p={3}
        sx={{
          alignItems: "center",
          borderTopWidth: "1px",
          borderTopStyle: "solid",
          borderTopColor: "border",
        }}
      >
        <Typography.Body
          mb={0}
          color="textMediumEmphasis"
          sx={{
            lineHeight: 1.4,
            fontSize: 1,
          }}
        >
          {subtext}
        </Typography.Body>
        <Spacer />
        <Button mr={3} variant="outline" onClick={onNegativeClick}>
          {negativeText}
        </Button>
        <Button
          variant="primary"
          onClick={onPositiveClick}
          disabled={disablePositiveButton}
          data-cy="dialogPositiveAction"
          sx={{ flexShrink: 0 }}
        >
          {positiveText}
        </Button>
      </Flex>
    </Flex>
  </Dialog>
)

export default ScrollableDialog
