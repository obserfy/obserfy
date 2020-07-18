import React, { FC, useState } from "react"
import { Button, Flex } from "theme-ui"
import Dialog from "../Dialog/Dialog"

import dayjs, { Dayjs } from "../../dayjs"
import { DialogHeader } from "../DialogHeader/DialogHeader"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"

const range = (length: number) => {
  return [...Array(length).keys()]
}

interface Props {
  defaultDate?: Dayjs
  onDismiss: () => void
  onConfirm: (date: Dayjs) => void
}
export const DatePickerDialog: FC<Props> = ({
  defaultDate,
  onDismiss,
  onConfirm,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    defaultDate ?? dayjs(Date.now())
  )
  const [monthShown, setMonth] = useState(selectedDate.startOf("month"))
  const isShowingCurrentMonth = monthShown.isSame(dayjs(Date.now()), "month")

  return (
    <Dialog sx={{ maxWidth: ["100%", 400] }}>
      <DialogHeader
        onAcceptText="Set"
        title="Pick a Date"
        onCancel={() => onDismiss()}
        onAccept={() => {
          onConfirm(selectedDate)
        }}
      />
      <Flex py={3} sx={{ alignItems: "flex-end" }}>
        <Typography.Body ml={3}>
          {monthShown.format("MMM YYYY")}
        </Typography.Body>
        <Button
          variant="outline"
          p={1}
          ml="auto"
          onClick={() => setMonth(monthShown.add(-1, "month"))}
        >
          <Icon as={PrevIcon} m={0} />
        </Button>
        <Button
          variant="outline"
          p={1}
          ml={1}
          onClick={() => setMonth(monthShown.add(1, "month"))}
        >
          <Icon as={NextIcon} m={0} />
        </Button>
        <Button
          variant="outline"
          py={1}
          sx={{ fontSize: 1 }}
          ml={1}
          mr={3}
          onClick={() => setMonth(dayjs(Date.now()).startOf("month"))}
          disabled={isShowingCurrentMonth}
        >
          This month
        </Button>
      </Flex>
      <Flex
        px={3}
        pb={2}
        sx={{
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor: "border",
          flexWrap: "wrap",
        }}
      >
        {["M", "T", "W", "T", "F", "S", "S"].map((dayInitial) => (
          <Typography.Body
            color="textMediumEmphasis"
            sx={{ textAlign: "center", width: "14.28%" }}
          >
            {dayInitial}
          </Typography.Body>
        ))}
      </Flex>
      <Flex sx={{ flexWrap: "wrap", minHeight: 258 }} px={3} pb={3} pt={2}>
        {range(monthShown.daysInMonth())
          .map((date) => date + 1)
          .map((date) => {
            const firstDateIndent =
              date === 1 ? `${14.28 * monthShown.day()}%` : 0
            const isCurrentDate =
              isShowingCurrentMonth && dayjs(Date.now()).date() === date

            const isSelected =
              selectedDate.isSame(monthShown, "month") &&
              selectedDate.date() === date

            return (
              <Button
                variant={isSelected ? "primary" : "secondary"}
                key={`${date}-${monthShown.month()}`}
                px={0}
                sx={{
                  fontWeight: isCurrentDate || isSelected ? "bold" : undefined,
                  width: "14.28%",
                }}
                color={
                  isCurrentDate && !isSelected ? "primaryDark" : "onBackground"
                }
                ml={firstDateIndent}
                onClick={() => setSelectedDate(monthShown.set("date", date))}
              >
                {date}
              </Button>
            )
          })}
      </Flex>
    </Dialog>
  )
}

export default DatePickerDialog
