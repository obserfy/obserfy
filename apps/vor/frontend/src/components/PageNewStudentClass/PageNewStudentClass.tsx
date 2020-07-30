import React, { FC, useState } from "react"
import { useImmer } from "use-immer"
import { Flex, Button, Box } from "theme-ui"
import BackNavigation from "../BackNavigation/BackNavigation"
import { EDIT_STUDENT_CLASS_URL } from "../../routes"

import { useGetStudent } from "../../api/useGetStudent"
import { Typography } from "../Typography/Typography"
import usePostNewClass from "../../api/classes/usePostNewClass"
import Input from "../Input/Input"
import Chip from "../Chip/Chip"

import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import { WEEKDAYS } from "../PageNewClass/PageNewClass"
import dayjs from "../../dayjs"
import { navigate } from "../Link/Link"
import usePostStudentClassRelation from "../../api/students/usePostStudentClassRelation"

interface Props {
  id: string
}
export const PageNewStudentClass: FC<Props> = ({ id }) => {
  const student = useGetStudent(id)

  const [name, setName] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [weekdays, setWeekdays] = useImmer<number[]>([])
  const [mutatePostNewClass, newClass] = usePostNewClass()
  const [
    mutatePostStudentClassRelation,
    newStudentClassRelation,
  ] = usePostStudentClassRelation(id)
  const valid = name !== ""

  const postNewClass = async (): Promise<void> => {
    const newClassResult = await mutatePostNewClass({
      name,
      weekdays,
      endTime: dayjs(endTime, "HH:mm").toDate(),
      startTime: dayjs(startTime, "HH:mm").toDate(),
    })
    if (newClassResult.ok) {
      const response = await newClassResult.json()
      await mutatePostStudentClassRelation(response.id)
      await navigate(EDIT_STUDENT_CLASS_URL(id))
    }
  }

  const isLoading =
    newClass.status === "loading" ||
    newStudentClassRelation.status === "loading"

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
      <BackNavigation to={EDIT_STUDENT_CLASS_URL(id)} text="Edit Class" />
      <Typography.H5 mx={3} mt={3} color="textDisabled">
        {student.data?.name}
      </Typography.H5>
      <Typography.H5 mx={3} mb={3}>
        New Class
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
          Available every
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
          onClick={postNewClass}
        >
          {isLoading && <LoadingIndicator mr={2} color="onPrimary" />}
          Save
        </Button>
        <ErrorMessage error={newClass.error} m={3} />
      </Box>
    </Box>
  )
}

export default PageNewStudentClass
