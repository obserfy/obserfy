import { Trans } from "@lingui/macro"
import React, { FC } from "react"
import { Image, Button, Card, Flex } from "theme-ui"
import { Typography } from "../Typography/Typography"
import StudentPicturePlaceholder from "../StudentPicturePlaceholder/StudentPicturePlaceholder"
import Icon from "../Icon/Icon"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import StudentPickerDialog from "../StudentPickerDialog/StudentPickerDialog"
import useVisibilityState from "../../hooks/useVisibilityState"
import useDeleteRelatedStudent from "../../api/plans/useDeleteRelatedStudent"
import usePostNewRelatedStudents from "../../api/plans/usePostNewRelatedStudents"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"

interface Student {
  id: string
  name: string
  profilePictureUrl?: string
}
const RelatedStudentsCard: FC<{
  planId: string
  students: Student[]
}> = ({ planId, students }) => {
  const dialog = useVisibilityState()
  const [postNewRelatedStudent] = usePostNewRelatedStudents(planId)

  const handlePostNewStudent = async (value: Student[]) => {
    const payload = {
      studentIds: value.map(({ id }) => id),
    }
    await postNewRelatedStudent(payload)
  }

  return (
    <Card p={3} sx={{ borderRadius: [0, "default"] }}>
      <Typography.Body color="textMediumEmphasis">
        <Trans>Related Students</Trans>
      </Typography.Body>
      {students.map(({ name, profilePictureUrl, id }) => (
        <StudentListItem
          key={id}
          studentId={id}
          planId={planId}
          name={name}
          profilePictureUrl={profilePictureUrl}
        />
      ))}
      <Button
        variant="outline"
        ml="auto"
        px={2}
        sx={{ color: "textMediumEmphasis" }}
        onClick={dialog.show}
        mt={3}
      >
        <Icon as={EditIcon} mr={2} />
        <Trans>Edit</Trans>
      </Button>
      {dialog.visible && (
        <StudentPickerDialog
          filteredIds={students.map(({ id }) => id)}
          onDismiss={dialog.hide}
          onAccept={handlePostNewStudent}
        />
      )}
    </Card>
  )
}

const StudentListItem: FC<{
  planId: string
  studentId: string
  name: string
  profilePictureUrl?: string
}> = ({ planId, studentId, profilePictureUrl, name }) => {
  const [deleteRelatedStudent] = useDeleteRelatedStudent(planId, studentId)

  const handleDeleteRelatedStudent = async () => {
    await deleteRelatedStudent()
  }

  return (
    <Flex sx={{ alignItems: "center" }} mt={3}>
      {profilePictureUrl ? (
        <Image src={profilePictureUrl} sx={{ borderRadius: "circle" }} />
      ) : (
        <StudentPicturePlaceholder />
      )}
      <Typography.Body ml={3}>{name}</Typography.Body>
      <Button
        variant="secondary"
        ml="auto"
        onClick={handleDeleteRelatedStudent}
      >
        <Icon as={TrashIcon} />
      </Button>
    </Flex>
  )
}

export default RelatedStudentsCard
