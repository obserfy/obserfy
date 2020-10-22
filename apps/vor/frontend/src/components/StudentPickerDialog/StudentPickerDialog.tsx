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
  const [selected, setSelected] = useImmer<Student[]>([])

  const unselectedStudents = students?.filter(
    (student) => filteredIds.findIndex((id) => student.id === id) === -1
  )

  const matched = unselectedStudents?.filter((student) =>
    student.name.match(new RegExp(search, "i"))
  )

  return (
    <Dialog>
      <DialogHeader
        onAcceptText={t`Add`}
        title={t`Select Students`}
        onCancel={onDismiss}
        onAccept={() => {
          onAccept(selected)
          onDismiss()
        }}
        disableAccept={selected.length === 0}
      />
      <Box
        pt={3}
        sx={{
          maxHeight: 300,
          overflowY: "scroll",
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
        {unselectedStudents?.length === 0 && (
          <Typography.Body m={3} sx={{ width: "100%", textAlign: "center" }}>
            <Trans>No more students to add</Trans>
          </Typography.Body>
        )}
        {matched?.map((student) => {
          const isSelected =
            selected.findIndex(({ id }) => id === student.id) !== -1

          return (
            <Flex
              key={student.id}
              pl={3}
              sx={{ ...borderBottom, alignItems: "center", cursor: "pointer" }}
              onClick={() => {
                if (!isSelected) {
                  setSelected((draft) => {
                    draft.push(student)
                  })
                } else {
                  setSelected((draft) =>
                    draft.filter(({ id }) => id !== student.id)
                  )
                }
              }}
            >
              <Typography.Body p={3} sx={{ width: "100%" }}>
                {student.name}
              </Typography.Body>
              {isSelected && (
                <Icon mr={3} as={CheckmarkIcon} fill="primaryDark" />
              )}
            </Flex>
          )
        })}
      </Box>
    </Dialog>
  )
}

export default StudentPickerDialog
