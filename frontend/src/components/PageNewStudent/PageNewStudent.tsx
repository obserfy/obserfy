import React, { FC, useState } from "react"
import { Link, navigate, useIntl } from "gatsby-plugin-intl3"
import Box from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Spacer from "../Spacer/Spacer"
import Button from "../Button/Button"
import { createStudentApi } from "../../api/students/createStudentApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import Icon from "../Icon/Icon"
import { ReactComponent as CalendarIcon } from "../../icons/calendar.svg"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"
import { getAnalytics } from "../../analytics"

export const PageNewStudent: FC = () => {
  const [name, setName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const isFormInvalid = name === ""
  const intl = useIntl()

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

  const dobField = (
    <Flex mt={3} onClick={() => setShowDatePicker(true)}>
      <Input
        label="Date of Birth"
        width="100%"
        value={
          dateOfBirth
            ? intl.formatDate(dateOfBirth, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""
        }
        placeholder="Not set"
        disabled
        sx={{
          opacity: "1!important",
        }}
      />
      <Button mt={23} ml={3} variant="outline" sx={{ flexShrink: 0 }}>
        <Icon as={CalendarIcon} m={0} />
      </Button>
    </Flex>
  )

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto">
        <BackNavigation to="/dashboard/observe" text="Home" />
        <Box mx={3} mt={3}>
          <Input
            label="Name"
            width="100%"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {dobField}
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
      {showDatePicker && (
        <DatePickerDialog
          defaultDate={dateOfBirth}
          onDismiss={() => setShowDatePicker(false)}
          onConfirm={date => {
            setDateOfBirth(date)
            setShowDatePicker(false)
          }}
        />
      )}
    </>
  )
}

export default PageNewStudent
