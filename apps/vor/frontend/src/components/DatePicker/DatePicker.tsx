import React, { FC } from "react"
import Input from "../Input/Input"
import Select from "../Select/Select"
import dayjs, { Dayjs } from "../../dayjs"
import Flex, { FlexProps } from "../Flex/Flex"

const MONTHS = [...Array(12).keys()].map((item) =>
  dayjs().set("month", item).format("MMMM")
)

interface Props extends Omit<FlexProps, "onChange" | "value"> {
  value: Dayjs
  onChange: (date: Dayjs) => void
}
export const DatePicker: FC<Props> = ({ onChange, value, ...props }) => {
  const daysInSelectedMonth = [...Array(value.daysInMonth()).keys()]

  return (
    <Flex {...props}>
      <Input
        mr={3}
        type="number"
        label="Year"
        min="1"
        inputMode="numeric"
        value={value.year()}
        onChange={({ target }) =>
          onChange(value.set("year", parseInt(target.value, 10)))
        }
      />
      <Select
        label="Month"
        value={value.month()}
        mr={3}
        onChange={({ target }) =>
          onChange(value.set("month", parseInt(target.value, 10)))
        }
      >
        {MONTHS.map((item, i) => (
          <option value={i} key={item}>
            {item}
          </option>
        ))}
      </Select>
      <Select
        label="Date"
        value={value.get("date")}
        onChange={({ target }) =>
          onChange(value.set("date", parseInt(target.value, 10)))
        }
      >
        {daysInSelectedMonth.map((item) => (
          <option value={item + 1} key={item}>
            {item + 1}
          </option>
        ))}
      </Select>
    </Flex>
  )
}

export default DatePicker
