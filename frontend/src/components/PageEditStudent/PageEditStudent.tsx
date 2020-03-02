import React, { FC, useEffect, useState } from "react"
import { navigate } from "gatsby"
import { useIntl } from "gatsby-plugin-intl3"
import Box from "../Box/Box"
import { useGetStudent } from "../../api/useGetStudent"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import BackNavigation from "../BackNavigation/BackNavigation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { getAnalytics } from "../../analytics"
import DeleteStudentDialog from "../DeleteStudentDialog/DeleteStudentDialog"
import Spacer from "../Spacer/Spacer"
import { deleteStudentApi } from "../../api/students/deleteStudentApi"
import { updateStudentApi } from "../../api/students/updateStudentApi"
import Icon from "../Icon/Icon"
import { ReactComponent as CalendarIcon } from "../../icons/calendar.svg"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"

interface Props {
  id: string
}
export const PageEditStudent: FC<Props> = ({ id }) => {
  const studentDetailUrl = `/dashboard/observe/students/details?id=${id}`
  const [isDeletingStudent, setIsDeletingStudent] = useState(false)
  const [details] = useGetStudent(id)
  const [name, setName] = useState<string>()
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const intl = useIntl()

  useEffect(() => {
    setName(details?.name ?? "")
    if (details?.dateOfBirth) {
      setDateOfBirth(new Date(details?.dateOfBirth))
    }
  }, [details])

  async function deleteStudent(): Promise<void> {
    const response = await deleteStudentApi(id)
    getAnalytics()?.track("Student Deleted", {
      responseStatus: response.status,
      studentName: name,
    })
    if (response.status === 200) {
      await navigate("/dashboard/observe")
    }
  }

  async function updateStudent(): Promise<void> {
    const response = await updateStudentApi({ id, name, dateOfBirth })
    getAnalytics()?.track("Student Updated", {
      responseStatus: response.status,
      studentName: name,
    })
    if (response.status === 200) {
      await navigate(studentDetailUrl)
    }
  }

  const deleteStudentDialog = isDeletingStudent && (
    <DeleteStudentDialog
      student={{ id, name: name ?? "" }}
      onConfirm={deleteStudent}
      onCancel={() => setIsDeletingStudent(false)}
    />
  )

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
      <Button mt={23} ml={3} variant="outline">
        <Icon as={CalendarIcon} m={0} sx={{ minWidth: 20 }} />
      </Button>
    </Flex>
  )

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto">
        <BackNavigation to={studentDetailUrl} text="Details" />
        <Box mx={3} mt={3}>
          {details?.name ? (
            <>
              <Input
                label="Name"
                width="100%"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              {dobField}
            </>
          ) : (
            <Box pt={24}>
              <LoadingPlaceholder width="100%" height={56} />
            </Box>
          )}
        </Box>
        <Flex m={3}>
          <Spacer />
          <Button
            mr={2}
            variant="outline"
            color="danger"
            onClick={() => setIsDeletingStudent(true)}
          >
            Delete
          </Button>
          <Button onClick={updateStudent}>Save</Button>
        </Flex>
      </Box>
      {deleteStudentDialog}
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

export default PageEditStudent
