import React, { FC, useState } from "react"
import { Box, Button, Flex } from "theme-ui"
import useGetSchoolClasses from "../../api/classes/useGetSchoolClasses"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import usePostNewPlan from "../../api/plans/usePostNewPlan"
import dayjs from "../../dayjs"
import BackNavigation from "../BackNavigation/BackNavigation"
import { STUDENT_PLANS_URL } from "../../routes"
import { Typography } from "../Typography/Typography"
import DateInput from "../DateInput/DateInput"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import EmptyClassDataPlaceholder from "../EmptyClassDataPlaceholder/EmptyClassDataPlaceholder"
import Chip from "../Chip/Chip"
import { navigate } from "../Link/Link"

interface Props {
  studentId: string
  chosenDate: string
}
export const PageNewStudentPlans: FC<Props> = ({ studentId, chosenDate }) => {
  const classes = useGetSchoolClasses()
  const areas = useGetCurriculumAreas()
  const [mutate] = usePostNewPlan()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [classId, setClassId] = useState("")
  const [areaId, setAreaId] = useState("")
  const [date, setDate] = useState(chosenDate ? dayjs(chosenDate) : dayjs())

  // Repetition data
  const [repetition, setRepetition] = useState(0)
  const [endDate, setEndDate] = useState(date)

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <BackNavigation
        to={STUDENT_PLANS_URL(studentId, date)}
        text="All plans"
      />
      <Typography.H5 m={3}>New Plan</Typography.H5>
      <Box mx={3}>
        <DateInput
          label="Date"
          value={date.toDate()}
          onChange={(value) => setDate(dayjs(value))}
          mb={2}
        />
        <Input
          label="Title"
          sx={{ width: "100%" }}
          mb={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          label="Description"
          mb={3}
          value={description}
          sx={{ width: "100%" }}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
        />
      </Box>

      {areas.status === "success" && areas.data.length === 0 ? (
        <Box mb={3}>
          <EmptyClassDataPlaceholder />
        </Box>
      ) : (
        <Box mx={3}>
          <Typography.H6 mb={2}>Related Area</Typography.H6>
          <Flex mb={3} sx={{ flexWrap: "wrap" }}>
            {areas.data?.map(({ id, name }) => (
              <Chip
                key={id}
                text={name}
                activeBackground="primary"
                onClick={() => {
                  if (id === areaId) {
                    setAreaId("")
                  } else {
                    setAreaId(id)
                  }
                }}
                isActive={id === areaId}
              />
            ))}
          </Flex>
        </Box>
      )}

      {classes.status === "success" && classes.data.length === 0 ? (
        <Box mb={3}>
          <EmptyClassDataPlaceholder />
        </Box>
      ) : (
        <Box mx={3}>
          <Typography.H6 mb={2}>Class</Typography.H6>
          <Flex mb={3}>
            {classes.data?.map(({ id, name }) => (
              <Chip
                key={id}
                text={name}
                activeBackground="primary"
                onClick={() => setClassId(id)}
                isActive={id === classId}
              />
            ))}
          </Flex>
        </Box>
      )}

      <Box mx={3}>
        <Typography.H6 mb={2}>Repetition</Typography.H6>
        <Flex>
          <Chip
            text="None"
            activeBackground="primary"
            onClick={() => setRepetition(0)}
            isActive={repetition === 0}
          />
          <Chip
            text="Daily"
            activeBackground="primary"
            onClick={() => setRepetition(1)}
            isActive={repetition === 1}
          />
          <Chip
            text="Weekly"
            activeBackground="primary"
            onClick={() => setRepetition(2)}
            isActive={repetition === 2}
          />
        </Flex>
        {repetition > 0 && (
          <Box mt={1}>
            <DateInput
              label="Repeat Until"
              value={endDate.toDate()}
              onChange={(value) => setEndDate(dayjs(value))}
              mb={2}
            />
          </Box>
        )}
      </Box>

      <Box mx={3} mb={4}>
        <Button
          disabled={title === ""}
          mt={3}
          onClick={async () => {
            const result = await mutate({
              areaId,
              title,
              description,
              classId,
              date,
              repetition:
                repetition === 0
                  ? undefined
                  : {
                      type: repetition,
                      endDate,
                    },
            })
            if (result.ok) {
              await navigate(STUDENT_PLANS_URL(studentId, date))
            }
          }}
          sx={{ width: "100%" }}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default PageNewStudentPlans
