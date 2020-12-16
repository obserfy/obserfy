import React, { FC } from "react"
import { Box, Button } from "theme-ui"
import { Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { Typography } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import Markdown from "../Markdown/Markdown"

export interface MultilineDataBoxProps {
  label: string
  value: string
  onEditClick?: () => void
  placeholder: string
}
export const MultilineDataBox: FC<MultilineDataBoxProps> = ({
  label,
  value,
  onEditClick,
  placeholder,
}) => {
  const { i18n } = useLingui()

  return (
    <Box px={3} py={3} sx={{ alignItems: "flex-start" }}>
      <Box mb={2}>
        <Typography.Body
          mb={2}
          color="textMediumEmphasis"
          sx={{ lineHeight: 1, fontSize: 1 }}
        >
          <Trans id={label} />
        </Typography.Body>
        <Markdown markdown={value || i18n._(placeholder)} mb={3} />
      </Box>
      <Button
        variant="outline"
        ml="auto"
        px={2}
        onClick={onEditClick}
        sx={{ flexShrink: 0, fontSize: 1, color: "textMediumEmphasis" }}
        aria-label={`edit-${label.toLowerCase()}`}
      >
        <Icon as={EditIcon} mr={2} />
        <Trans>Edit</Trans> <Trans id={label} />
      </Button>
    </Box>
  )
}

export default MultilineDataBox
