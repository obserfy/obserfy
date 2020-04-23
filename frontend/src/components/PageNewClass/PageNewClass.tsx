import React, { FC, useState } from "react"
import { useImmer } from "use-immer"
import dayjs from "dayjs"
import { navigate } from "../Link/Link"
import BackNavigation from "../BackNavigation/BackNavigation"
import { CLASS_SETTINGS_URL } from "../../routes"
import { Box } from "../Box/Box"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import { Typography } from "../Typography/Typography"
import Chip from "../Chip/Chip"
import usePostNewClass from "../../api/usePostNewClass"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import ErrorMessage from "../ErrorMessage/ErrorMessage"

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export const PageNewClass: FC = () => {
  const [name, setName] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [weekdays, setWeekdays] = useImmer<number[]>([])
  const [mutate, { status, error }] = usePostNewClass()

  const valid = name !== ""

  const postNewClass = async (): Promise<void> => {
    const result = await mutate({
      name,
      weekdays,
      endTime: dayjs(endTime, "HH:mm").toDate(),
      startTime: dayjs(startTime, "HH:mm").toDate(),
    })
    if (result) {
      await navigate(CLASS_SETTINGS_URL)
    }
  }

  return (
    <Box maxWidth="maxWidth.sm" margin="auto">
      <BackNavigation to={CLASS_SETTINGS_URL} text="Class" />
      <Typography.H5 m={3}>New Class</Typography.H5>
      <Box m={3}>
        <Input
          label="Name"
          width="100%"
          mb={3}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Flex>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            label="Start Time"
            width="100%"
            mb={3}
            mr={3}
          />
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            label="End Time"
            width="100%"
            mb={3}
          />
        </Flex>
        <Typography.Body mb={2} color="textMediumEmphasis">
          Available every
        </Typography.Body>
        <Flex mb={3} flexWrap="wrap">
          {WEEKDAYS.map((weekday, i) => (
            <Chip
              key={weekday}
              text={weekday}
              activeBackground="primary"
              isActive={weekdays.includes(i)}
              onClick={() =>
                setWeekdays((draft) => {
                  if (draft.includes(i)) {
                    return draft.filter((item) => item !== i)
                  }
                  return [...draft, i]
                })
              }
            />
          ))}
        </Flex>
        <Button
          width="100%"
          disabled={!valid || status === "loading"}
          onClick={postNewClass}
        >
          {status === "loading" && (
            <LoadingIndicator mr={2} color="onPrimary" />
          )}
          Save
        </Button>
        <ErrorMessage error={error} m={3} />
      </Box>
    </Box>
  )
}

export default PageNewClass
