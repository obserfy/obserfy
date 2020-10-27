import React, { FC } from "react"
import { useImmer } from "use-immer"
import { t, Trans } from "@lingui/macro"
import { Box, Flex } from "theme-ui"
import {
  Student,
  useGetAllStudents,
} from "../../api/students/useGetAllStudents"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import { Typography } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as CheckmarkIcon } from "../../icons/checkmark-outline.svg"
import { borderBottom } from "../../border"
import useInputState from "../../hooks/useInputState"

export interface StudentPickerDialogProps {
  filteredIds: string[]
  onDismiss: () => void
  onAccept: (student: Student[]) => void
}
const StudentPickerDialog: FC<StudentPickerDialogProps> = ({
  filteredIds,
  onDismiss,
  onAccept,
}) => {
  const { data: students } = useGetAllStudents("", true)
  const [search, setSearch] = useInputState("")
  const [result, setResult] = useImmer<Student[]>([])

  const unselectedStudents =
    students?.filter(({ id }) => !filteredIds.find((item) => id === item)) ?? []

  const matched = unselectedStudents.filter(({ name }) =>
    name.match(new RegExp(search, "i"))
  )

  const addStudent = (student: Student) => {
    setResult((draft) => {
      draft.push(student)
    })
  }

  const removeStudent = (id: string) => {
    setResult((draft) => draft.filter((item) => item.id !== id))
  }

  return (
    <Dialog>
      <DialogHeader
        onAcceptText={t`Add`}
        title={t`Select Students`}
        onCancel={onDismiss}
        onAccept={() => {
          onAccept(result)
          onDismiss()
        }}
        disableAccept={result.length === 0}
      />
      <Box
        pt={3}
        sx={{
          maxHeight: 300,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Input
          mx={3}
          mb={3}
          sx={{ backgroundColor: "background", width: "100%" }}
          placeholder="Search student"
          value={search}
          onChange={setSearch}
        />
        {unselectedStudents.length === 0 && (
          <Typography.Body py={4} sx={{ width: "100%", textAlign: "center" }}>
            <Trans>No more students to add</Trans>
          </Typography.Body>
        )}
        {matched.map((student) => {
          const selected = result.find(({ id }) => id === student.id)

          const toggleStudent = () => {
            if (!selected) addStudent(student)
            else removeStudent(student.id)
          }

          return (
            <StudentItem
              key={student.id}
              isSelected={selected !== undefined}
              name={student.name}
              onClick={toggleStudent}
            />
          )
        })}
      </Box>
    </Dialog>
  )
}

const StudentItem: FC<{
  name: string
  isSelected: boolean
  onClick: () => void
}> = ({ name, isSelected, onClick }) => (
  <Flex
    pl={3}
    sx={{ ...borderBottom, alignItems: "center", cursor: "pointer" }}
    onClick={onClick}
  >
    <Typography.Body p={3} sx={{ width: "100%" }}>
      {name}
    </Typography.Body>
    {isSelected && <Icon mr={3} as={CheckmarkIcon} fill="primaryDark" />}
  </Flex>
)

export default StudentPickerDialog
