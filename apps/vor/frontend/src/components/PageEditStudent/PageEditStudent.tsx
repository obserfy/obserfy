import React, { FC, useEffect, useState } from "react"
import { navigate } from "gatsby"
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
import DateInput from "../DateInput/DateInput"

interface Props {
  id: string
}
export const PageEditStudent: FC<Props> = ({ id }) => {
  const studentDetailUrl = `/dashboard/observe/students/details?id=${id}`
  const [isDeletingStudent, setIsDeletingStudent] = useState(false)
  const [name, setName] = useState<string>()
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const student = useGetStudent(id)

  useEffect(() => {
    setName(student.data?.name ?? "")
    if (student.data?.dateOfBirth) {
      setDateOfBirth(new Date(student.data?.dateOfBirth))
    }
  }, [student.data])

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

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto">
        <BackNavigation to={studentDetailUrl} text="Details" />
        <Box mx={3} mt={3}>
          {student.data?.name ? (
            <>
              <Input
                label="Name"
                width="100%"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <DateInput
                label="Date of Birth"
                onChange={setDateOfBirth}
                value={dateOfBirth}
              />
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
    </>
  )
}

export default PageEditStudent
