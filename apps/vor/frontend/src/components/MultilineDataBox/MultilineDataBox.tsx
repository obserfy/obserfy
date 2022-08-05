import { Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { FC } from "react"
import { Box, Button, Flex } from "theme-ui"
import { borderBottom } from "../../border"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import Icon from "../Icon/Icon"
import Markdown from "../Markdown/Markdown"
import { Typography } from "../Typography/Typography"

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
    <Box sx={{ alignItems: "flex-start" }}>
      <Flex sx={{ ...borderBottom, alignItems: "center" }}>
        <Typography.Body m={3} sx={{ fontWeight: "bold" }}>
          <Trans id={label} />
        </Typography.Body>
        <Button
          variant="text"
          ml="auto"
          mr={3}
          p={2}
          onClick={onEditClick}
          aria-label={`edit-${label.toLowerCase()}`}
          data-cy={`edit-${label.toLowerCase()}`}
          sx={{ color: "textMediumEmphasis" }}
        >
          <Icon as={EditIcon} />
        </Button>
      </Flex>

      <Markdown markdown={value || i18n._(placeholder)} mx={3} mt={3} mb={2} />
    </Box>
  )
}

export default MultilineDataBox
