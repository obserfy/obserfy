import { Trans } from "@lingui/macro"
import React, { FC } from "react"
import { Image, Button, Card, Flex } from "theme-ui"
import { Typography } from "../Typography/Typography"
import StudentPicturePlaceholder from "../StudentPicturePlaceholder/StudentPicturePlaceholder"
import Icon from "../Icon/Icon"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import StudentPickerDialog from "../StudentPickerDialog/StudentPickerDialog"
import useVisibilityState from "../../hooks/useVisibilityState"

interface Student {
  id: string
  name: string
  profilePictureUrl?: string
}
const RelatedStudentsCard: FC<{
  students: Student[]
}> = ({ students }) => {
  const dialog = useVisibilityState()

  return (
    <Card p={3} sx={{ borderRadius: [0, "default"] }}>
      <Typography.Body color="textMediumEmphasis">
        <Trans>Related Students</Trans>
      </Typography.Body>
      {students.map(({ name, profilePictureUrl, id }) => (
        <StudentListItem
          key={id}
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
      >
        <Icon as={EditIcon} mr={2} />
        <Trans>Edit</Trans>
      </Button>
      {dialog.visible && (
        <StudentPickerDialog
          filteredIds={students.map(({ id }) => id)}
          onDismiss={dialog.hide}
          onAccept={(students) => {}}
        />
      )}
    </Card>
  )
}

const StudentListItem: FC<{ name: string; profilePictureUrl?: string }> = ({
  profilePictureUrl,
  name,
}) => (
  <Flex sx={{ alignItems: "center" }} mt={3}>
    {profilePictureUrl ? (
      <Image src={profilePictureUrl} sx={{ borderRadius: "circle" }} />
    ) : (
      <StudentPicturePlaceholder />
    )}
    <Typography.Body ml={3}>{name}</Typography.Body>
  </Flex>
)

export default RelatedStudentsCard
