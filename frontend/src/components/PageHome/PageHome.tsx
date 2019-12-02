import React, { FC, useState } from "react"
import { Link } from "gatsby"
import { Box } from "../Box/Box"
import SearchBar from "../SearchBar/SearchBar"
import { Flex } from "../Flex/Flex"
import Icon from "../Icon/Icon"
import Button from "../Button/Button"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { Typography } from "../Typography/Typography"
import Card from "../Card/Card"
import MockAvatar from "../mockAvatar"
import { useQueryAllStudents } from "../../hooks/students/useQueryAllStudents"
import NewStudentDialog from "../NewStudentDialog/NewStudentDialog"
import EmptyListPlaceholder from "../EmptyListPlaceholder/EmptyListPlaceholder"

export const PageHome: FC = () => {
  const [showStudentInputDialog, setShowStudentInputDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudentsAsOutdated] = useQueryAllStudents()

  async function submitNewStudent(name: string): Promise<void> {
    const baseUrl = "/api/v1"
    const newStudent = { name }

    await fetch(`${baseUrl}/students`, {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    })

    setShowStudentInputDialog(false)
    setStudentsAsOutdated()
  }

  const studentList = students.map(({ name, id }) => (
    <Link to={`/students/details?id=${id}`} key={id}>
      <Card p={3} mx={3} mb={2}>
        <Flex>
          <MockAvatar />
          <Typography.H6>{name}</Typography.H6>
        </Flex>
      </Card>
    </Link>
  ))

  return (
    <>
      <Box>
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
          >
            <Icon as={PlusIcon} m={0} />
          </Button>
        </Flex>
        {students.length > 0 && studentList}
        {students.length === 0 && searchTerm !== "" && (
          <Flex
            mt={3}
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography.H6 textAlign="center" maxWidth="80vw">
              The term <i>&quot;{searchTerm}&quot;</i> does not match any
              student
            </Typography.H6>
          </Flex>
        )}
        {students.length === 0 && (
          <EmptyListPlaceholder
            text="You have no one enrolled"
            callToActionText="New student"
            onActionClick={() => setShowStudentInputDialog(true)}
          />
        )}
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

export default PageHome
