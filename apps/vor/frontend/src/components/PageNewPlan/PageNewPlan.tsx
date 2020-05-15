/** @jsx jsx */
import { FC, useState } from "react"
import { jsx } from "theme-ui"
import { Box } from "../Box/Box"
import Input from "../Input/Input"
import BackNavigation from "../BackNavigation/BackNavigation"
import { ALL_PLANS_URL } from "../../routes"
import { Typography } from "../Typography/Typography"
import Button from "../Button/Button"
import useGetSchoolClasses from "../../api/useGetSchoolClasses"
import Chip from "../Chip/Chip"
import { Flex } from "../Flex/Flex"
import TextArea from "../TextArea/TextArea"
import DateInput from "../DateInput/DateInput"
import usePostNewPlan from "../../api/usePostNewPlan"
import dayjs from "../../dayjs"
import { navigate } from "../Link/Link"

interface Props {
  chosenDate: string
}

export const PageNewPlan: FC<Props> = ({ chosenDate }) => {
  const classes = useGetSchoolClasses()
  const [mutate] = usePostNewPlan()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [classId, setClassId] = useState("")
  const [date, setDate] = useState(dayjs(chosenDate))

  return (
    <Box maxWidth="maxWidth.sm" mx="auto">
      <BackNavigation to={ALL_PLANS_URL} text="All plans" />
      <Typography.H5 m={3}>New Plan</Typography.H5>
      <Box p={3}>
        <DateInput
          label="Date"
          value={date.toDate()}
          onChange={(value) => setDate(dayjs(value))}
          mb={2}
        />
        <Input
          label="Title"
          width="100%"
          mb={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          label="Description"
          width="100%"
          mb={3}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
        />
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
        <Button
          width="100%"
          disabled={classId === "" || title === ""}
          onClick={async () => {
            const result = await mutate({
              title,
              description,
              classId,
              date,
            })
            if (result.status === 201) {
              await navigate(ALL_PLANS_URL)
            }
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default PageNewPlan
