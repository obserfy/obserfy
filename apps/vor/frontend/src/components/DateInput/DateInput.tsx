import React, { FC, useState } from "react"
import { Button, Flex, BoxProps, SxStyleProp } from "theme-ui"
import Input from "../Input/Input"
import Icon from "../Icon/Icon"
import { ReactComponent as CalendarIcon } from "../../icons/calendar.svg"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"

import dayjs, { Dayjs } from "../../dayjs"

interface Props extends Omit<BoxProps, "value" | "onChange"> {
  value?: Dayjs
  label?: string
  onChange: (date: Dayjs) => void
  containerSx?: SxStyleProp
}
export const DateInput: FC<Props> = ({
  label,
  value,
  onChange,
  containerSx,
  ...props
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false)

  return (
    <Flex
      sx={{ ...containerSx }}
      onClick={() => setShowDatePicker(true)}
      {...props}
    >
      <Input
        label={label}
        sx={{
          opacity: "1!important",
          width: "100%",
        }}
        value={!value ? "" : dayjs(value).format("D MMMM 'YY")}
        placeholder="Not set"
        disabled
      />
      <Button
        data-cy={label}
        mt={label ? 23 : 0}
        ml={2}
        variant="outline"
        sx={{ flexShrink: 0 }}
      >
        <Icon as={CalendarIcon} />
      </Button>
      {showDatePicker && (
        <DatePickerDialog
          defaultDate={value}
          onDismiss={() => setShowDatePicker(false)}
          onConfirm={(date) => {
            onChange(date)
            setShowDatePicker(false)
          }}
        />
      )}
    </Flex>
  )
}

export default DateInput
