import { Trans } from "@lingui/macro"
import { FC } from "react"
import { Button, Flex, ThemeUIStyleObject } from "theme-ui"
import Input from "../Input/Input"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

const LinkInput: FC<{
  value?: string
  onChange: (value: string) => void
  onSave: () => void
  isLoading?: boolean
  containerSx?: ThemeUIStyleObject
  inputSx?: ThemeUIStyleObject
}> = ({ inputSx, containerSx, value, onChange, onSave, isLoading }) => (
  <Flex sx={containerSx}>
    <Input
      aria-label="URL"
      sx={{ width: "100%", ...inputSx }}
      p={2}
      placeholder="https://...."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <Button
      data-cy="add-link"
      ml={2}
      variant="outline"
      disabled={value === "" || isLoading}
      onClick={onSave}
    >
      {isLoading ? <LoadingIndicator /> : <Trans>Add</Trans>}
    </Button>
  </Flex>
)

export default LinkInput
