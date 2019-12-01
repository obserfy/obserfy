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
import ScrollableDialog from "../ScrollableDialog/ScrollableDialog"
import Input from "../Input/Input"
import MockAvatar from "../mockAvatar"
import {
  Student,
  useQueryAllStudents,
} from "../../hooks/students/useQueryAllStudents"

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
        {students.length > 0 && <ChildrenList students={students} />}
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
          <Flex
            mt={3}
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography.H6>You have no one enrolled</Typography.H6>
          </Flex>
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

const ChildrenList: FC<{ students: Student[] }> = ({ students }) => {
  return (
    <Box>
      {students.map(({ name, id }) => {
        return (
          <Link to={`/students/edit?id=${id}`} key={id}>
            <Card p={3} mx={3} mb={3}>
              <Flex>
                <MockAvatar />
                <Typography.H6>{name}</Typography.H6>
              </Flex>
            </Card>
          </Link>
        )
      })}
    </Box>
  )
}

interface NewStudentDialogProps {
  onCancel: () => void
  onConfirm: (name: string) => void
}

const NewStudentDialog: FC<NewStudentDialogProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [name, setName] = useState("")
  return (
    <ScrollableDialog
      title="New Student"
      positiveText="Add student"
      negativeText="Cancel"
      onPositiveClick={() => onConfirm(name)}
      onDismiss={onCancel}
      onNegativeClick={onCancel}
      disablePositiveButton={name === ""}
    >
      <Box p={3}>
        <Input
          label="Full Name"
          width="100%"
          placeholder="Erica Sterling"
          onChange={e => setName(e.target.value)}
          value={name}
          onEnterPressed={() => onConfirm(name)}
        />
      </Box>
    </ScrollableDialog>
  )
}

export default PageHome
