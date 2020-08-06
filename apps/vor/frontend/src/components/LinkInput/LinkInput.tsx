import React, { FC } from "react"
import { Button, Flex, FlexProps } from "theme-ui"
import Input from "../Input/Input"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

const LinkInput: FC<
  Omit<FlexProps, "onChange"> & {
    value?: string
    onChange: (value: string) => void
    onSave: () => void
    isLoading: boolean
  }
> = ({ value, onChange, onSave, isLoading, ...props }) => (
  <Flex {...props}>
    <Input
      aria-label="URL"
      sx={{ width: "100%" }}
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
