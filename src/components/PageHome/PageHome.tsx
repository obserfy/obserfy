import React, { FC, useState } from "react"
import { Box } from "../Box/Box"
import SearchBar from "../SearchBar/SearchBar"
import { Flex } from "../Flex/Flex"
import Icon from "../Icon/Icon"
import Button from "../Button/Button"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { Typography } from "../Typography/Typography"
import Card from "../Card/Card"
import Avatar from "../Avatar/Avatar"
import ScrollableDialog from "../ScrollableDialog/ScrollableDialog"
import Input from "../Input/Input"
import { Link } from "gatsby"

export const PageHome: FC = () => {
  const [showStudentInputDialog, setShowStudentInputDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState<string[]>(["Poe Dameron"])

  const matchedStudent = students.filter(student =>
    student.includes(searchTerm)
  )
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
        {matchedStudent.length > 0 && (
          <ChildrenList students={matchedStudent} />
        )}
        {matchedStudent.length === 0 && searchTerm !== "" && (
          <Flex
            mt={3}
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography.H6 textAlign="center" maxWidth="80vw">
              The term <i>"{searchTerm}"</i> does not match any student
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
          onConfirm={name => {
            setStudents([...students, name])
            setShowStudentInputDialog(false)
          }}
        />
      )}
    </>
  )
}

const ChildrenList: FC<{ students: string[] }> = ({ students }) => {
  return (
    <Box>
      {students.map(student => {
        return (
          <Link to={`/edit?name=${student}`}>
            <Card p={3} mx={3} mb={3}>
              <Flex>
                <Avatar
                  src="https://images.unsplash.com/photo-1571942727532-a67a4bf9845a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
                  mr={3}
                />
                <Typography.H6>{student}</Typography.H6>
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
