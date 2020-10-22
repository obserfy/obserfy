import { Trans } from "@lingui/macro"
import React, { FC } from "react"
import { Image, Button, Card, Flex } from "theme-ui"
import { Typography } from "../Typography/Typography"
import StudentPicturePlaceholder from "../StudentPicturePlaceholder/StudentPicturePlaceholder"
import Icon from "../Icon/Icon"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"

const RelatedStudentsCard: FC<{
  students: Array<{
    id: string
    name: string
    profilePictureUrl?: string
  }>
}> = ({ students }) => {
  return (
    <Card p={3} sx={{ borderRadius: [0, "default"] }}>
      <Typography.Body color="textMediumEmphasis">
        <Trans>Related Students</Trans>
      </Typography.Body>
      {students.map(({ name, profilePictureUrl, id }) => (
        <Flex key={id} sx={{ alignItems: "center" }} mt={3}>
          {profilePictureUrl ? (
            <Image src={profilePictureUrl} sx={{ borderRadius: "circle" }} />
          ) : (
            <StudentPicturePlaceholder />
          )}
          <Typography.Body ml={3}>{name}</Typography.Body>
        </Flex>
      ))}
      <Button
        variant="outline"
        ml="auto"
        px={2}
        sx={{ flexShrink: 0, fontSize: 1, color: "textMediumEmphasis" }}
      >
        <Icon as={EditIcon} mr={2} />
        <Trans>Edit</Trans>
      </Button>
    </Card>
  )
}

export default RelatedStudentsCard
