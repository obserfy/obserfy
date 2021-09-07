import { Trans } from "@lingui/macro"
import { FC } from "react"
import { Button, Card, Flex, Image } from "theme-ui"
import useDeleteRelatedStudent from "../../hooks/api/plans/useDeleteRelatedStudent"
import usePostNewRelatedStudents from "../../hooks/api/plans/usePostNewRelatedStudents"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import Icon from "../Icon/Icon"
import StudentPickerDialog from "../StudentPickerDialog/StudentPickerDialog"
import StudentPicturePlaceholder from "../StudentPicturePlaceholder/StudentPicturePlaceholder"
import { Typography } from "../Typography/Typography"

interface Student {
  id: string
  name: string
  profileImageUrl?: string
}
const RelatedStudentsCard: FC<{
  planId: string
  studentId: string
  students: Student[]
}> = ({ planId, students, studentId }) => {
  const dialog = useVisibilityState()
  const postNewRelatedStudent = usePostNewRelatedStudents(planId)

  const handlePostNewStudent = async (value: Student[]) => {
    const payload = {
      studentIds: value.map(({ id }) => id),
    }
    try {
      await postNewRelatedStudent.mutateAsync(payload)
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  const otherStudents = students.filter(({ id }) => id !== studentId)

  return (
    <Card p={3} sx={{ borderRadius: [0, "default"] }}>
      <Flex>
        <Typography.Body color="textMediumEmphasis">
          <Trans>Other Related Students</Trans>
        </Typography.Body>
        <Button
          variant="outline"
          ml="auto"
          sx={{ color: "textMediumEmphasis", fontSize: 1 }}
          onClick={dialog.show}
        >
          <Trans>Add More</Trans>
        </Button>
      </Flex>
      {otherStudents.map(({ name, profileImageUrl, id }) => (
        <StudentListItem
          key={id}
          studentId={id}
          planId={planId}
          name={name}
          profilePictureUrl={profileImageUrl}
        />
      ))}
      {otherStudents.length === 0 && (
        <Typography.Body py={4} sx={{ textAlign: "center" }}>
          <Trans>No other students added yet.</Trans>
        </Typography.Body>
      )}

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
  const deleteRelatedStudent = useDeleteRelatedStudent(planId, studentId)

  const handleDeleteRelatedStudent = async () => {
    try {
      await deleteRelatedStudent.mutateAsync()
    } catch (e) {
      Sentry.captureException(e)
    }
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
        data-cy="delete-student"
        variant="text"
        ml="auto"
        onClick={handleDeleteRelatedStudent}
      >
        <Icon as={TrashIcon} />
      </Button>
    </Flex>
  )
}

export default RelatedStudentsCard
