import React, { FC } from "react"
import { Button, Flex, SxStyleProp } from "theme-ui"
import Input from "../Input/Input"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

const LinkInput: FC<{
  value?: string
  onChange: (value: string) => void
  onSave: () => void
  isLoading: boolean
  containerSx?: SxStyleProp
  inputSx?: SxStyleProp
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
      ml={2}
      variant="outline"
      disabled={value === "" || isLoading}
      onClick={onSave}
    >
      {isLoading ? <LoadingIndicator /> : "Add"}
    </Button>
  </Flex>
)

export default LinkInput
