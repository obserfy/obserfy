import React, { FC, useEffect, useState } from "react"
import { navigate } from "gatsby"
import Box from "../Box/Box"
import { useQueryStudentDetails } from "../../hooks/students/useQueryStudentDetails"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import BackNavigation from "../BackNavigation/BackNavigation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { getAnalytics } from "../../analytics"
import DeleteStudentDialog from "../DeleteStudentDialog/DeleteStudentDialog"
import Spacer from "../Spacer/Spacer"

interface Props {
  id: string
}
export const PageEditStudent: FC<Props> = ({ id }) => {
  const studentDetailUrl = `/dashboard/students/details?id=${id}`
  const [isDeletingStudent, setIsDeletingStudent] = useState(false)
  const [details] = useQueryStudentDetails(id)
  const [name, setName] = useState()

  useEffect(() => {
    setName(details?.name)
  }, [details])

  async function deleteStudent(): Promise<void> {
    const baseUrl = "/api/v1"

    const response = await fetch(`${baseUrl}/students/${id}`, {
      credentials: "same-origin",
      method: "DELETE",
    })

    if (response.status === 200) {
      navigate("/dashboard/home")
    }

    getAnalytics()?.track("Student Deleted", {
      responseStatus: response.status,
      studentName: name,
    })
  }

  async function updateStudent(): Promise<void> {
    const baseUrl = "/api/v1"
    const data = { name }

    const response = await fetch(`${baseUrl}/students/${id}`, {
      credentials: "same-origin",
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })

    if (response.status === 200) {
      navigate(studentDetailUrl)
    }

    getAnalytics()?.track("Student Updated", {
      responseStatus: response.status,
      studentName: name,
    })
  }

  const deleteStudentDialog = isDeletingStudent && (
    <DeleteStudentDialog
      student={{ id, name }}
      onConfirm={deleteStudent}
      onCancel={() => setIsDeletingStudent(false)}
    />
  )

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto">
        <BackNavigation to={studentDetailUrl} text="Details" />
        <Box mx={3} mt={3}>
          {details?.name ? (
            <Input
              label="Name"
              width="100%"
              value={name}
              onChange={e => setName(e.target.value)}
            />
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
