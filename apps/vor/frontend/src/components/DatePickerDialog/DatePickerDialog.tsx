import { t } from "@lingui/macro"
import { FC, memo, useState } from "react"
import { Box, Button, Flex } from "theme-ui"
import { borderBottom } from "../../border"

import dayjs, { Dayjs } from "../../dayjs"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as LeftDoubleArrowIcon } from "../../icons/left-double-arrow.svg"
import { ReactComponent as NestedCircleIcon } from "../../icons/nested-circle.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as RightDoubleArrowIcon } from "../../icons/right-double-arrow.svg"
import Dialog from "../Dialog/Dialog"
import { DialogHeader } from "../DialogHeader/DialogHeader"
import Icon from "../Icon/Icon"
import Typography from "../Typography/Typography"

const range = (length: number) => [...Array(length).keys()]

export interface DatePickerDialogProps {
  defaultDate?: Dayjs
  enabledDates?: Dayjs[]
  onDismiss: () => void
  onConfirm: (date: Dayjs) => void
  isLoading?: boolean
  title?: string
}
export const DatePickerDialog: FC<DatePickerDialogProps> = ({
  defaultDate,
  onDismiss,
  onConfirm,
  isLoading,
  enabledDates,
  title,
}) => {
  const currentDate = dayjs()
  const [selected, setSelectedDate] = useState(defaultDate ?? dayjs())
  const [month, setMonth] = useState(selected.startOf("month"))
  const isSelectedToday = selected.isSame(currentDate, "date")

  return (
    <Dialog sx={{ maxWidth: ["100%", 400] }}>
      <DialogHeader
        loading={isLoading}
        onAcceptText={t`Set`}
        title={title || t`Pick a Date`}
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
          data-cy="prev-year"
        >
          <Icon as={LeftDoubleArrowIcon} />
        </Button>
        <Button
          variant="outline"
          p={1}
          ml={1}
          onClick={() => setMonth(month.add(-1, "month"))}
          data-cy="prev-month"
        >
          <Icon as={PrevIcon} />
        </Button>

        <Button
          variant="outline"
          p={1}
          ml={1}
          onClick={() => setMonth(month.add(1, "month"))}
          data-cy="next-month"
        >
          <Icon as={NextIcon} />
        </Button>
        <Button
          variant="outline"
          p={1}
          ml={1}
          onClick={() => setMonth(month.add(1, "year"))}
          data-cy="next-year"
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
            const today = dayjs().startOf("day")
            setMonth(today.startOf("month"))
            const idx = enabledDates?.findIndex((d) => d.isSame(today, "day"))
            if (idx === undefined || idx !== -1) {
              setSelectedDate(today)
            }
          }}
          disabled={isSelectedToday && month.isSame(currentDate, "month")}
        >
          <Icon as={NestedCircleIcon} fill="textPrimary" />
        </Button>
      </Flex>
      <DatesTable
        month={month}
        onDateClick={(date) => setSelectedDate(date)}
        selected={selected}
        enabledDates={enabledDates}
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
  enabledDates?: Dayjs[]
}> = ({ month, onDateClick, selected, enabledDates }) => (
  <>
    <WeekDayInitials />
    <Flex sx={{ flexWrap: "wrap", minHeight: 250 }} mx={3} my={2}>
      {range(month.daysInMonth()).map((number) => {
        const date = number + 1
        const fullDate = month.set("date", date)

        const firstRowIndent = date === 1 ? `${14.28 * month.day()}%` : 0

        const isToday = dayjs().isSame(fullDate, "date")

        const isSelected = selected.isSame(fullDate, "date")

        const disabled =
          enabledDates === undefined
            ? false
            : enabledDates.findIndex((d) => d.isSame(fullDate, "day")) === -1

        return (
          <Flex
            key={`${date}-${month.unix()}`}
            ml={firstRowIndent}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              width: "14.28%",
            }}
          >
            <Button
              variant={isSelected ? "primary" : "text"}
              color={isSelected ? "onPrimary" : "text"}
              px={0}
              sx={{
                fontWeight: isToday || isSelected ? "bold" : undefined,
                height: 40,
                width: 40,
              }}
              onClick={() => onDateClick(fullDate)}
              disabled={disabled}
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
    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
      <Typography.Body
        key={weekday}
        sx={{ textAlign: "center", width: "14.28%" }}
      >
        {weekday[0]}
      </Typography.Body>
    ))}
  </Flex>
))

export default DatePickerDialog
