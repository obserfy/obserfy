import React, { FC, useState } from "react"
import { Flex, Button } from "theme-ui"
import Dialog from "../Dialog/Dialog"
import Select from "../Select/Select"
import Input from "../Input/Input"
import { Typography } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import Spacer from "../Spacer/Spacer"

import dayjs from "../../dayjs"

interface Props {
  defaultDate?: Date
  onDismiss: () => void
  onConfirm: (date: Date) => void
}
export const DatePickerDialog: FC<Props> = ({
  defaultDate,
  onDismiss,
  onConfirm,
}) => {
  const [year, setYear] = useState(
    defaultDate?.getFullYear().toString() ?? "2020"
  )
  const [month, setMonth] = useState(defaultDate?.getMonth().toString() ?? "0")
  const [date, setDate] = useState(defaultDate?.getDate().toString() ?? "1")

  const generatedDate = new Date(
    parseInt(year === "" ? "2020" : year, 10),
    parseInt(month, 10),
    parseInt(date, 10)
  )

  const title = (
    <Flex
      p={3}
      sx={{
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "border",
      }}
    >
      <Typography.H6
        mb={0}
        mr={3}
        sx={{
          fontWeight: "bold",
          flex: 1,
          overflowY: "auto",
        }}
      >
        Pick a Date
      </Typography.H6>
      <Icon
        as={CloseIcon}
        m={0}
        sx={{
          width: 32,
          cursor: "pointer",
        }}
        onClick={onDismiss}
      />
    </Flex>
  )

  const footer = (
    <Flex
      p={3}
      sx={{
        alignItems: "center",
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        borderTopColor: "border",
      }}
    >
      <Spacer />
      <Button mr={3} variant="outline" onClick={onDismiss}>
        Cancel
      </Button>
      <Button
        variant="primary"
        data-cy="set-button"
        onClick={() => onConfirm(generatedDate)}
      >
        Set
      </Button>
    </Flex>
  )

  return (
    <Dialog>
      {title}
      <Flex
        p={3}
        sx={{
          backgroundColor: "background",
        }}
      >
        <Input
          mr={3}
          type="number"
          label="Year"
          sx={{ width: "100%" }}
          min="1"
          inputMode="numeric"
          value={year}
          onChange={(e) => {
            setYear(e.target.value)
          }}
        />
        <Select
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          mr={3}
        >
          {[...Array(12).keys()].map((item) => (
            <option value={item} key={item}>
              {dayjs(new Date(1, item, 1)).format("MMMM")}
            </option>
          ))}
        </Select>
        <Select
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        >
          {[...Array(dayjs(generatedDate).endOf("month").date()).keys()].map(
            (item) => (
              <option value={item + 1} key={item}>
                {item + 1}
              </option>
            )
          )}
        </Select>
      </Flex>
      {footer}
    </Dialog>
  )
}

export default DatePickerDialog
