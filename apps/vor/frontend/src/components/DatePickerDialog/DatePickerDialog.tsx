import React, { FC, useState } from "react"
import { Button, Flex } from "theme-ui"
import Dialog from "../Dialog/Dialog"

import dayjs, { Dayjs } from "../../dayjs"
import { DialogHeader } from "../DialogHeader/DialogHeader"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { borderBottom } from "../../border"

const range = (length: number) => [...Array(length).keys()]

export interface DatePickerDialogProps {
  defaultDate?: Dayjs
  onDismiss: () => void
  onConfirm: (date: Dayjs) => void
}
export const DatePickerDialog: FC<DatePickerDialogProps> = ({
  defaultDate,
  onDismiss,
  onConfirm,
}) => {
  const currentDate = dayjs()
  const [selected, setSelectedDate] = useState(defaultDate ?? dayjs())
  const [month, setMonth] = useState(selected.startOf("month"))
  const isShowingCurrentMonth = month.isSame(currentDate, "month")

  return (
    <Dialog sx={{ maxWidth: ["100%", 400] }}>
      <DialogHeader
        onAcceptText="Set"
        title="Pick a Date"
        onCancel={() => onDismiss()}
        onAccept={() => {
          onConfirm(selected)
        }}
      />
      <Flex py={3}>
        <Typography.Body ml={3} sx={{ fontWeight: "bold" }}>
          {month.format("MMM YYYY")}
        </Typography.Body>
        <Button
          variant="outline"
          p={1}
          ml="auto"
          onClick={() => setMonth(month.add(-1, "month"))}
          data-cy="prev"
        >
          <Icon as={PrevIcon} />
        </Button>
        <Button
          variant="outline"
          p={1}
          ml={1}
          onClick={() => setMonth(month.add(1, "month"))}
          data-cy="next"
        >
          <Icon as={NextIcon} />
        </Button>
        <Button
          variant="outline"
          py={1}
          sx={{ fontSize: 1 }}
          ml={1}
          mr={3}
          onClick={() => setMonth(dayjs())}
          disabled={isShowingCurrentMonth}
        >
          This month
        </Button>
      </Flex>
      <DatesTable
        month={month}
        onDateClick={(date) => setSelectedDate(date)}
        selected={selected}
      />
      <Typography.Body
        px={4}
        py={3}
        backgroundColor="background"
        sx={{ fontWeight: "bold" }}
      >
        {selected.format("dddd, DD MMM YYYY")}
      </Typography.Body>
    </Dialog>
  )
}

const DatesTable: FC<{
  selected: Dayjs
  month: Dayjs
  onDateClick: (date: Dayjs) => void
}> = ({ month, onDateClick, selected }) => (
  <>
    <Flex px={3} pb={2} sx={{ ...borderBottom }}>
      {["S", "M", "T", "W", "T", "F", "S"].map((weekday) => (
        <Typography.Body sx={{ textAlign: "center", width: "14.28%" }}>
          {weekday}
        </Typography.Body>
      ))}
    </Flex>
    <Flex sx={{ flexWrap: "wrap", minHeight: 250 }} mx={3} my={2}>
      {range(month.daysInMonth()).map((number) => {
        const date = number + 1
        const fullDate = month.set("date", date)

        const firstRowIndent = date === 1 ? `${14.28 * month.day()}%` : 0

        const isToday = dayjs().isSame(fullDate, "date")

        const isSelected = selected.isSame(fullDate, "date")

        return (
          <Flex
            key={`${date}-${month.month()}`}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              width: "14.28%",
            }}
            ml={firstRowIndent}
          >
            <Button
              variant={isSelected ? "primary" : "secondary"}
              px={0}
              sx={{
                fontWeight: isToday || isSelected ? "bold" : undefined,
                height: 40,
                width: 40,
              }}
              color={isToday && !isSelected ? "textPrimary" : "onBackground"}
              onClick={() => onDateClick(fullDate)}
            >
              {date}
            </Button>
          </Flex>
        )
      })}
    </Flex>
  </>
)

export default DatePickerDialog
