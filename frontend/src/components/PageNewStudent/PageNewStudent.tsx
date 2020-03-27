import React, { FC, useState } from "react"
import { navigate } from "gatsby-plugin-intl3"
import Box from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import Input from "../Input/Input"
import Button from "../Button/Button"
import { createStudentApi } from "../../api/students/createStudentApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import { getAnalytics } from "../../analytics"
import DateInput from "../DateInput/DateInput"
import TextArea from "../TextArea/TextArea"
import { Typography } from "../Typography/Typography"
import Select from "../Select/Select"

export const PageNewStudent: FC = () => {
  const [name, setName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [entryDate, setEntryDate] = useState<Date>()
  const isFormInvalid = name === ""

  async function createNewStudent(): Promise<void> {
    const response = await createStudentApi(getSchoolId(), {
      name,
      dateOfBirth,
    })
    getAnalytics()?.track("Student Created", {
      responseStatus: response.status,
      studentName: name,
    })
    if (response.status === 201) navigate("/dashboard/observe")
  }

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto" pb={4}>
        <BackNavigation to="/dashboard/observe" text="Home" />
        <Typography.H4 m={3}>New Student</Typography.H4>
        <Box mx={3} mt={3}>
          <Input
            label="Name (Required)"
            width="100%"
            value={name}
            onChange={(e) => setName(e.target.value)}
            mb={3}
          />
          <DateInput
            label="Date of Birth"
            value={dateOfBirth}
            onChange={setDateOfBirth}
            mb={3}
          />
          <DateInput
            label="Entry Date"
            value={entryDate}
            onChange={setEntryDate}
            mb={3}
          />
          <Select label="Gender" mb={3}>
            <option>Not Set</option>
            <option>Male</option>
            <option>Female</option>
          </Select>
          <Input label="Student ID" width="100%" mb={3} />
          <TextArea label="Notes" height={100} />
        </Box>
        <Typography.H5 m={3}>Classes</Typography.H5>
        <Typography.H5 m={3}>Guardians</Typography.H5>
        <Box p={3}>
          <Button
            width="100%"
            onClick={createNewStudent}
            disabled={isFormInvalid}
          >
            Save
          </Button>
        </Box>
      </Box>
      {}
    </>
  )
}

export default PageNewStudent
