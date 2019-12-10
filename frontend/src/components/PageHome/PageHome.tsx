import React, { FC, useState } from "react"
import { navigate } from "gatsby"
import { Box } from "../Box/Box"
import SearchBar from "../SearchBar/SearchBar"
import { Flex } from "../Flex/Flex"
import Icon from "../Icon/Icon"
import Button from "../Button/Button"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { Typography } from "../Typography/Typography"
import Card from "../Card/Card"
import { useQueryAllStudents } from "../../hooks/students/useQueryAllStudents"
import NewStudentDialog from "../NewStudentDialog/NewStudentDialog"
import EmptyListPlaceholder from "../EmptyListPlaceholder/EmptyListPlaceholder"
import { getSchoolId } from "../../hooks/schoolIdState"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { getAnalytics } from "../../analytics"

export const PageHome: FC = () => {
  const schoolId = getSchoolId()
  const [showStudentInputDialog, setShowStudentInputDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [
    students,
    setStudentsAsOutdated,
    studentsIsLoading,
  ] = useQueryAllStudents(schoolId)

  const matchedStudent = students.filter(student =>
    student.name.includes(searchTerm)
  )

  async function submitNewStudent(name: string): Promise<void> {
    const baseUrl = "/api/v1"
    const newStudent = { name }

    const response = await fetch(`${baseUrl}/schools/${schoolId}/students`, {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    })

    setShowStudentInputDialog(false)
    setStudentsAsOutdated()
    getAnalytics()?.track("Student Created", {
      responseStatus: response.status,
      studentName: name,
    })
  }

  const studentList = matchedStudent.map(({ name, id }) => (
    <Card
      p={3}
      mx={3}
      mb={2}
      key={id}
      onClick={() => navigate(`/students/details?id=${id}`)}
      sx={{ cursor: "pointer" }}
    >
      <Flex>
        <Typography.H6>{name}</Typography.H6>
      </Flex>
    </Card>
  ))

  const emptyStudentListPlaceholder = students.length === 0 && (
    <Box mx={3}>
      <EmptyListPlaceholder
        text="You have no one enrolled"
        callToActionText="New student"
        onActionClick={() => setShowStudentInputDialog(true)}
      />
    </Box>
  )

  const emptyResultInfo = students.length > 0 &&
    matchedStudent.length === 0 &&
    searchTerm !== "" && (
      <Flex mt={3} alignItems="center" justifyContent="center" height="100%">
        <Typography.H6 textAlign="center" maxWidth="80vw">
          The term <i>&quot;{searchTerm}&quot;</i> does not match any student
        </Typography.H6>
      </Flex>
    )

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto">
        <Flex p={3}>
          <SearchBar
            mr={3}
            placeholder="Search students"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => setShowStudentInputDialog(true)}
            data-cy="addStudent"
          >
            <Icon as={PlusIcon} m={0} />
          </Button>
        </Flex>
        {!studentsIsLoading && students.length > 0 && studentList}
        {!studentsIsLoading && emptyResultInfo}
        {!studentsIsLoading && emptyStudentListPlaceholder}
        {studentsIsLoading && <StudentListLoadingPlaceholder />}
      </Box>
      {showStudentInputDialog && (
        <NewStudentDialog
          onCancel={() => setShowStudentInputDialog(false)}
          onConfirm={submitNewStudent}
        />
      )}
    </>
  )
}

const StudentListLoadingPlaceholder: FC = () => (
  <Box px={3}>
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
  </Box>
)

export default PageHome
