import React, { FC, useState } from "react"
import { Box, Card, Flex } from "theme-ui"
import BackNavigation from "../BackNavigation/BackNavigation"
import {
  Guardians,
  useGetSchoolGuardians,
} from "../../api/guardians/useGetSchoolGuardians"
import { Student, useGetStudent } from "../../api/useGetStudent"
import { Typography } from "../Typography/Typography"

import { NEW_GUARDIANS_URL, STUDENT_PROFILE_URL } from "../../routes"
import SearchBar from "../SearchBar/SearchBar"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ReactComponent as LinkIcon } from "../../icons/link.svg"
import { ReactComponent as RemoveIcon } from "../../icons/close.svg"

import GuardianRelationshipPickerDialog from "../GuardianRelationshipPickerDialog/GuardianRelationshipPickerDialog"
import { usePostGuardianRelation } from "../../api/guardians/usePostGuardianRelation"
import { Link } from "../Link/Link"
import { Button } from "../Button/Button"
import { useDeleteGuardianRelation } from "../../api/guardians/useDeleteGuardianRelation"
import Dialog from "../Dialog/Dialog"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import GuardianRelationshipPill from "../GuardianRelationshipPill/GuardianRelationshipPill"

interface Props {
  studentId: string
}
export const PageEditGuardians: FC<Props> = ({ studentId }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const student = useGetStudent(studentId)
  const guardians = useGetSchoolGuardians()

  const filteredGuardians = guardians.data?.filter((guardian) => {
    return (
      guardian.name.match(new RegExp(searchTerm, "i")) &&
      !student.data?.guardians.map(({ id }) => id).includes(guardian.id)
    )
  })

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <BackNavigation
        to={STUDENT_PROFILE_URL(studentId)}
        text="Student Profile"
      />
      <Typography.H5 mx={3} mt={3} color="textDisabled">
        {student.data?.name}
      </Typography.H5>
      <Typography.H5 mx={3} mb={3}>
        Edit Guardians
      </Typography.H5>
      <Typography.Body mx={3} mb={2} color="textMediumEmphasis">
        Current guardians
      </Typography.Body>
      {(student.data?.guardians.length ?? 0) === 0 && (
        <Card sx={{ borderRadius: [0, "default"] }} mb={2} mx={[0, 3]}>
          <Typography.Body
            m={3}
            color="textMediumEmphasis"
            sx={{
              fontSize: 1,
            }}
          >
            No guardians set yet
          </Typography.Body>
        </Card>
      )}
      {student.data?.guardians.map(
        (guardian) =>
          guardian && (
            <CurrentGuardiansCard
              key={`current${guardian.id}`}
              guardian={guardian}
              studentId={studentId}
            />
          )
      )}
      <Card sx={{ borderRadius: [0, "default"] }} mb={2} mx={[0, 3]}>
        <Link
          to={NEW_GUARDIANS_URL(studentId)}
          data-cy="new-guardian"
          style={{ display: "block" }}
        >
          <Flex sx={{ alignItems: "center" }} p={3}>
            <Typography.Body
              sx={{
                lineHeight: 1,
                fontSize: 1,
              }}
            >
              Create new guardian
            </Typography.Body>
            <Icon
              as={LinkIcon}
              m={0}
              ml="auto"
              mr={2}
              fill="textMediumEmphasis"
            />
          </Flex>
        </Link>
      </Card>
      <Typography.Body mx={3} mt={4} color="textMediumEmphasis">
        Select from existing guardian
      </Typography.Body>
      <Box px={3} pb={3} pt={2}>
        <SearchBar
          sx={{ width: "100%" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {filteredGuardians?.map((guardian) => {
        return (
          <OtherGuardiansCard
            key={guardian.id}
            studentId={studentId}
            guardian={guardian}
          />
        )
      })}
    </Box>
  )
}

const CurrentGuardiansCard: FC<{
  guardian: Student["guardians"][0]
  studentId: string
}> = ({ guardian, studentId }) => {
  const [showDialog, setShowDialog] = useState(false)
  const [mutate, { error, status }] = useDeleteGuardianRelation(
    guardian.id,
    studentId
  )

  return (
    <>
      <Card sx={{ borderRadius: [0, "default"] }} mb={2} mx={[0, 3]}>
        <Flex sx={{ alignItems: "center" }}>
          <Flex
            py={3}
            sx={{
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <Typography.Body
              sx={{
                lineHeight: 1,
              }}
              mb={3}
              ml={3}
            >
              {guardian.name}
            </Typography.Body>
            <GuardianRelationshipPill
              relationship={guardian.relationship}
              ml={3}
            />
          </Flex>
          <Button
            mr={3}
            ml="auto"
            variant="outline"
            px={2}
            onClick={() => setShowDialog(true)}
            data-cy="remove-guardian"
          >
            <Icon as={RemoveIcon} m={0} fill="danger" />
          </Button>
        </Flex>
      </Card>
      {showDialog && (
        <Dialog>
          <Flex
            sx={{ alignItems: "center", position: "relative" }}
            backgroundColor="surface"
            py={1}
          >
            <Typography.H6
              sx={{
                width: "100%",
                position: "absolute",
                pointerEvents: "none",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              Remove Guardian?
            </Typography.H6>
            <Button
              variant="secondary"
              my={1}
              onClick={() => setShowDialog(false)}
              ml={2}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              ml="auto"
              my={1}
              color="danger"
              onClick={async () => {
                const result = await mutate()
                if (!error && result?.status === 201) {
                  setShowDialog(false)
                }
              }}
              mr={2}
              data-cy="remove"
            >
              {status === "loading" && <LoadingIndicator />} Remove
            </Button>
          </Flex>
          <Typography.Body p={3}>
            Do you really want to remove {guardian.name}?
          </Typography.Body>
        </Dialog>
      )}
    </>
  )
}

const OtherGuardiansCard: FC<{ guardian: Guardians; studentId: string }> = ({
  guardian,
  studentId,
}) => {
  const [showDialog, setShowDialog] = useState(false)
  const [mutate, { error, status }] = usePostGuardianRelation(
    guardian,
    studentId
  )

  return (
    <>
      <Card sx={{ borderRadius: [0, "default"] }} mb={[0, 2]} mx={[0, 3]}>
        <Flex sx={{ alignItems: "center" }}>
          <Box p={3}>
            <Typography.Body
              sx={{
                lineHeight: 1,
              }}
              mb={2}
            >
              {guardian.name}
            </Typography.Body>
            <Typography.Body
              color="textMediumEmphasis"
              sx={{
                lineHeight: 1,
                fontSize: 1,
              }}
            >
              {guardian.email || "No email"}
            </Typography.Body>
          </Box>
          <Button
            variant="outline"
            ml="auto"
            mr={3}
            px={2}
            onClick={() => setShowDialog(true)}
            data-cy="add-guardian"
          >
            <Icon as={PlusIcon} m={0} fill="primaryDark" />
          </Button>
        </Flex>
      </Card>
      {showDialog && (
        <GuardianRelationshipPickerDialog
          loading={status === "loading"}
          onDismiss={() => setShowDialog(false)}
          onAccept={async (relationship) => {
            const result = await mutate(relationship)
            if (!error && result?.status === 201) {
              setShowDialog(false)
            }
          }}
        />
      )}
    </>
  )
}

export default PageEditGuardians
