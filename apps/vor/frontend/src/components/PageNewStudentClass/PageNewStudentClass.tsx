import { FC, useState } from "react"
import { useImmer } from "use-immer"
import { Flex, Button, Box } from "theme-ui"
import { Trans } from "@lingui/macro"
import BackNavigation from "../BackNavigation/BackNavigation"
import { EDIT_STUDENT_CLASS_URL } from "../../routes"

import { useGetStudent } from "../../hooks/api/useGetStudent"
import { Typography } from "../Typography/Typography"
import usePostNewClass from "../../hooks/api/classes/usePostNewClass"
import Input from "../Input/Input"
import Chip from "../Chip/Chip"

import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import { WEEKDAYS } from "../PageNewClass/PageNewClass"
import dayjs from "../../dayjs"
import { navigate } from "../Link/Link"
import usePostStudentClassRelation from "../../hooks/api/students/usePostStudentClassRelation"

interface Props {
  id: string
}
export const PageNewStudentClass: FC<Props> = ({ id }) => {
  const student = useGetStudent(id)

  const [name, setName] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [weekdays, setWeekdays] = useImmer<number[]>([])
  const postNewClass = usePostNewClass()
  const postStudentClassRelation = usePostStudentClassRelation(id)
  const valid = name !== ""

  const handleSubmit = async (): Promise<void> => {
    try {
      const newClassResult = await postNewClass.mutateAsync({
        name,
        weekdays,
        endTime: dayjs(endTime, "HH:mm").toDate(),
        startTime: dayjs(startTime, "HH:mm").toDate(),
      })

      const response = await newClassResult.json()
      await postStudentClassRelation.mutateAsync(response.id)
      await navigate(EDIT_STUDENT_CLASS_URL(id))
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  const isLoading = postNewClass.isLoading || postStudentClassRelation.isLoading

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
      <BackNavigation to={EDIT_STUDENT_CLASS_URL(id)} text="Edit Class" />
      <Typography.H5 mx={3} mt={3} color="textDisabled">
        {student.data?.name}
      </Typography.H5>
      <Typography.H5 mx={3} mb={3}>
        <Trans>New Class</Trans>
      </Typography.H5>
      <Box m={3}>
        <Input
          label="Name"
          sx={{ width: "100%" }}
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
            sx={{ width: "100%" }}
            mb={3}
            mr={3}
          />
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            label="End Time"
            sx={{ width: "100%" }}
            mb={3}
          />
        </Flex>
        <Typography.Body mb={2} color="textMediumEmphasis">
          <Trans>Available every</Trans>
        </Typography.Body>
        <Flex
          mb={3}
          sx={{
            flexWrap: "wrap",
          }}
        >
          {WEEKDAYS.map((weekday, i) => (
            <Chip
              mb={2}
              mr={2}
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
          sx={{ width: "100%" }}
          disabled={!valid || isLoading}
          onClick={handleSubmit}
        >
          {isLoading && <LoadingIndicator mr={2} color="onPrimary" />}
          <Trans>Save</Trans>
        </Button>
        <ErrorMessage error={postNewClass.error} m={3} />
      </Box>
    </Box>
  )
}

export default PageNewStudentClass
