import React, { FC, useState } from "react"
import { useIntl } from "gatsby-plugin-intl3"
import lastDayOfMonth from "date-fns/lastDayOfMonth"
import Dialog from "../Dialog/Dialog"
import Select from "../Select/Select"
import Flex from "../Flex/Flex"
import Input from "../Input/Input"
import { Typography } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import Spacer from "../Spacer/Spacer"
import Button from "../Button/Button"

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

  const intl = useIntl()

  const title = (
    <Flex
      alignItems="center"
      p={3}
      sx={{
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "border",
      }}
    >
      <Typography.H6 mb={0} mr={3} fontWeight="bold" flex={1} overflowY="auto">
        Pick a Date
      </Typography.H6>
      <Icon
        as={CloseIcon}
        size={32}
        m={0}
        sx={{ cursor: "pointer" }}
        onClick={onDismiss}
      />
    </Flex>
  )

  const footer = (
    <Flex
      p={3}
      alignItems="center"
      sx={{
        borderTopWidth: 1,
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
      <Flex p={3} backgroundColor="background">
        <Input
          mr={3}
          type="number"
          label="Year"
          width="100%"
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
              {intl.formatDate(new Date(1, item, 1), {
                month: "long",
              })}
            </option>
          ))}
        </Select>
        <Select
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        >
          {[...Array(lastDayOfMonth(generatedDate).getDate()).keys()].map(
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
