/** @jsx jsx */
import { FC } from "react"
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

export const PageNewPlan: FC = () => {
  const classes = useGetSchoolClasses()

  return (
    <Box maxWidth="maxWidth.sm" mx="auto">
      <BackNavigation to={ALL_PLANS_URL} text="All plans" />
      <Typography.H5 m={3}>New Plan</Typography.H5>
      <Box p={3}>
        <DateInput label="Date" onChange={() => {}} mb={2} />
        <Input label="Title" width="100%" mb={2} />
        <TextArea label="Description" width="100%" mb={3} />
        <Typography.H6 mb={2}>Class</Typography.H6>
        <Flex mb={3}>
          {classes.data?.map(({ id, name }) => (
            <Chip key={id} text={name} activeBackground="primary" />
          ))}
        </Flex>
        <Button width="100%">Save</Button>
      </Box>
    </Box>
  )
}

export default PageNewPlan
