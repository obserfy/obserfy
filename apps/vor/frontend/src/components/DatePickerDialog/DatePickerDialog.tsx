import React, { FC, memo, useState } from "react"
import { Box, Button, Flex } from "theme-ui"
import Dialog from "../Dialog/Dialog"

import dayjs, { Dayjs } from "../../dayjs"
import { DialogHeader } from "../DialogHeader/DialogHeader"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as NestedCircleIcon } from "../../icons/nested-circle.svg"
import { ReactComponent as RightDoubleArrowIcon } from "../../icons/right-double-arrow.svg"
import { ReactComponent as LeftDoubleArrowIcon } from "../../icons/left-double-arrow.svg"
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
  const isSelectedToday = selected.isSame(currentDate, "date")

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
      <Flex py={3} sx={{ alignItems: "center", touchAction: "manipulation" }}>
        <Typography.Body ml={3}>{month.format("MMM YYYY")}</Typography.Body>
        <Button
          variant="outline"
          p={1}
          ml="auto"
          onClick={() => setMonth(month.add(-1, "year"))}
          data-cy="prev"
        >
          <Icon as={LeftDoubleArrowIcon} />
        </Button>
        <Button
          variant="outline"
          p={1}
          ml={1}
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
          p={1}
          ml={1}
          onClick={() => setMonth(month.add(1, "year"))}
          data-cy="next"
        >
          <Icon as={RightDoubleArrowIcon} />
        </Button>
        <Button
          variant="outline"
          p={1}
          mr={3}
          sx={{ fontSize: 1 }}
          ml={1}
          onClick={() => {
            setMonth(dayjs().startOf("month"))
            setSelectedDate(dayjs())
          }}
          disabled={isSelectedToday}
        >
          <Icon as={NestedCircleIcon} fill="textPrimary" />
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
    <WeekDayInitials />
    <Flex sx={{ flexWrap: "wrap", minHeight: 250 }} mx={3} my={2}>
      {range(month.daysInMonth()).map((number) => {
        const date = number + 1
        const fullDate = month.set("date", date)

        const firstRowIndent = date === 1 ? `${14.28 * month.day()}%` : 0

        const isToday = dayjs().isSame(fullDate, "date")

        const isSelected = selected.isSame(fullDate, "date")

        return (
          <Flex
            key={`${date}-${month.unix()}`}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              width: "14.28%",
            }}
            ml={firstRowIndent}
          >
            <Button
              variant={isSelected ? "primary" : "secondary"}
              color={isSelected ? "onPrimary" : "text"}
              px={0}
              sx={{
                fontWeight: isToday || isSelected ? "bold" : undefined,
                height: 40,
                width: 40,
              }}
              onClick={() => onDateClick(fullDate)}
            >
              <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
                <Box>{date}</Box>
                {isToday && (
                  <Icon
                    size={10}
                    as={NestedCircleIcon}
                    fill={isSelected ? "onPrimary" : "textPrimary"}
                  />
                )}
              </Flex>
            </Button>
          </Flex>
        )
      })}
    </Flex>
  </>
)

const WeekDayInitials: FC = memo(() => (
  <Flex px={3} pb={2} sx={{ ...borderBottom, userSelect: "none" }}>
    {["S", "M", "T", "W", "T", "F", "S"].map((weekday) => (
      <Typography.Body sx={{ textAlign: "center", width: "14.28%" }}>
        {weekday}
      </Typography.Body>
    ))}
  </Flex>
))

export default DatePickerDialog
