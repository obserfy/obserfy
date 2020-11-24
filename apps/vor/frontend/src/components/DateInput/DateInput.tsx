import React, { FC, useState } from "react"
import { Button, Flex, BoxProps, SxStyleProp } from "theme-ui"
import { t } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import Input from "../Input/Input"
import Icon from "../Icon/Icon"
import { ReactComponent as CalendarIcon } from "../../icons/calendar.svg"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"

import dayjs, { Dayjs } from "../../dayjs"

interface Props extends Omit<BoxProps, "value" | "onChange" | "css"> {
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
  const { i18n } = useLingui()

  return (
    <>
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
          value={!value ? "" : dayjs(value).format("dddd, DD MMM YYYY")}
          placeholder={i18n._(t`Not Set`)}
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
