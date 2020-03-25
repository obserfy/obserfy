import React, { FC, useState } from "react"
import { useIntl } from "gatsby-plugin-intl3"
import Input from "../Input/Input"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import { ReactComponent as CalendarIcon } from "../../icons/calendar.svg"
import Flex from "../Flex/Flex"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"

interface Props {
  value?: Date
  onChange: (date: Date) => void
}
export const DateInput: FC<Props> = ({ value, onChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const intl = useIntl()

  return (
    <>
      <Flex mt={3} onClick={() => setShowDatePicker(true)}>
        <Input
          label="Date of Birth"
          width="100%"
          value={
            !value
              ? ""
              : intl.formatDate(value, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
          }
          placeholder="Not set"
          disabled
          sx={{
            opacity: "1!important",
          }}
        />
        <Button mt={23} ml={3} variant="outline" sx={{ flexShrink: 0 }}>
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
