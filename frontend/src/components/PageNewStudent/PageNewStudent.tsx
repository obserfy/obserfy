import React, { FC, useState } from "react"
import { Link, navigate } from "gatsby-plugin-intl3"
import Box from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Spacer from "../Spacer/Spacer"
import Button from "../Button/Button"
import { createStudentApi } from "../../api/students/createStudentApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import { getAnalytics } from "../../analytics"
import DateInput from "../DateInput/DateInput"

export const PageNewStudent: FC = () => {
  const [name, setName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
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
      <Box maxWidth="maxWidth.sm" margin="auto">
        <BackNavigation to="/dashboard/observe" text="Home" />
        <Box mx={3} mt={3}>
          <Input
            label="Name"
            width="100%"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <DateInput value={dateOfBirth} onChange={setDateOfBirth} />
        </Box>
        <Flex m={3}>
          <Spacer />
          <Link to="/dashboard/observe">
            <Button variant="outline" mr={2}>
              Cancel
            </Button>
          </Link>
          <Button onClick={createNewStudent} disabled={isFormInvalid}>
            Save
          </Button>
        </Flex>
      </Box>
      {}
    </>
  )
}

export default PageNewStudent
