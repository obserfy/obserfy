import React, { FC, useState } from "react"
import Input from "../Input/Input"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import { ReactComponent as CalendarIcon } from "../../icons/calendar.svg"
import Flex from "../Flex/Flex"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"
import { BoxProps } from "../Box/Box"
import dayjs from "../../dayjs"

interface Props extends Omit<BoxProps, "value" | "onChange"> {
  value?: Date
  label?: string
  onChange: (date: Date) => void
}
export const DateInput: FC<Props> = ({ label, value, onChange, ...props }) => {
  const [showDatePicker, setShowDatePicker] = useState(false)

  return (
    <>
      <Flex onClick={() => setShowDatePicker(true)} {...props}>
        <Input
          label={label}
          width="100%"
          value={!value ? "" : dayjs(value).format("D MMMM 'YY")}
          placeholder="Not set"
          disabled
          sx={{
            opacity: "1!important",
          }}
        />
        <Button
          data-cy={label}
          mt={23}
          ml={3}
          variant="outline"
          sx={{ flexShrink: 0 }}
        >
          <Icon as={CalendarIcon} m={0} />
        </Button>
      </Flex>
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
    </>
  )
}

export default DateInput
