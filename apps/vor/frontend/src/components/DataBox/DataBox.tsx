import React, { FC } from "react"
import { Box, Button, Flex } from "theme-ui"
import { Trans } from "@lingui/macro"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"

export interface DataBoxProps {
  label: string
  value: string
  onEditClick?: () => void
  isEditing?: boolean
}
export const DataBox: FC<DataBoxProps> = ({ label, value, onEditClick }) => (
  <Flex px={3} py={3} sx={{ alignItems: "flex-start" }}>
    <Box>
      <Typography.Body
        mb={1}
        color="textMediumEmphasis"
        sx={{ lineHeight: 1, fontSize: 0 }}
      >
        <Trans id={label} />
      </Typography.Body>
      <Typography.Body>{value}</Typography.Body>
    </Box>
    <Button
      variant="outline"
      ml="auto"
      px={2}
      onClick={onEditClick}
      sx={{ flexShrink: 0 }}
      aria-label={`edit-${label.toLowerCase()}`}
    >
      <Icon as={EditIcon} />
    </Button>
  </Flex>
)

export default DataBox
