import React, { FC, useEffect, useRef, useState } from "react"
import { useImmer } from "use-immer"
import parse from "date-fns/parse"
import { navigate } from "gatsby-plugin-intl3"
import format from "date-fns/format"
import { CLASS_SETTINGS_URL } from "../../pages/dashboard/settings/class"
import { Box } from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Chip from "../Chip/Chip"
import Button from "../Button/Button"
import { WEEKDAYS } from "../PageNewClass/PageNewClass"
import useGetClass from "../../api/useGetClass"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import usePatchClass from "../../api/usePatchClass"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

interface Props {
  classId: string
}
export const PageEditClass: FC<Props> = ({ classId }) => {
  const [name, setName] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [weekdays, setWeekdays] = useImmer<number[]>([])
  const [mutate, { status, error }] = usePatchClass(classId)
  const classes = useGetClass(classId)
  const isLoaded = useRef(false)
  const valid = name !== ""

  useEffect(() => {
    const target = classes.data
    if (!target || isLoaded.current) return
    const start = Date.parse(target.startTime)
    const end = Date.parse(target.endTime)
    setName(target.name)
    setStartTime(format(start, "HH:mm"))
    setEndTime(format(end, "HH:mm"))
    setWeekdays(() => target.weekdays)
    isLoaded.current = true
  }, [classes.data, setWeekdays])

  const patchClass = async (): Promise<void> => {
    const result = await mutate({
      name,
      weekdays,
      endTime: parse(endTime, "HH:mm", new Date()),
      startTime: parse(startTime, "HH:mm", new Date()),
    })
    if (result) {
      await navigate(CLASS_SETTINGS_URL)
    }
  }

  return (
    <Box maxWidth="maxWidth.sm" margin="auto">
      <BackNavigation to={CLASS_SETTINGS_URL} text="Class" />
      <Typography.H5 m={3}>Edit Class</Typography.H5>
      {classes.status === "loading" && <LoadingState />}
      {classes.status === "success" && (
        <Box m={3}>
          <Input
            label="Name"
            width="100%"
            mb={3}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Flex>
            <Input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              label="Start Time"
              width="100%"
              mb={3}
              mr={3}
            />
            <Input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
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
                  setWeekdays(draft => {
                    if (draft.includes(i)) {
                      return draft.filter(item => item !== i)
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
            onClick={patchClass}
          >
            {status === "loading" && (
              <LoadingIndicator mr={2} color="onPrimary" />
            )}
            Save
          </Button>
          <Typography.Body textAlign="center" m={3} color="error">
            {error?.message}
          </Typography.Body>
        </Box>
      )}
    </Box>
  )
}

const LoadingState: FC = () => {
  return (
    <Box m={3} mt={4}>
      <LoadingPlaceholder width="12rem" height={48} mb={3} />
      <LoadingPlaceholder width="100%" height={48} mb={3} />
      <Flex mb={3}>
        <LoadingPlaceholder width="100%" height={48} mr={3} />
        <LoadingPlaceholder width="100%" height={48} />
      </Flex>
      <LoadingPlaceholder width="100%" height={48} mb={3} />
      <LoadingPlaceholder width="100%" height={48} mb={3} />
    </Box>
  )
}

export default PageEditClass
