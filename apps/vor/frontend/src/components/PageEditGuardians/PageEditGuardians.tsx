import React, { FC, useState } from "react"
import BackNavigation from "../BackNavigation/BackNavigation"
import {
  Guardians,
  useGetSchoolGuardians,
} from "../../api/useGetSchoolGuardians"
import { Student, useGetStudent } from "../../api/useGetStudent"
import { Typography } from "../Typography/Typography"
import { Card } from "../Card/Card"
import { NEW_GUARDIANS_URL, STUDENT_PROFILE_URL } from "../../routes"
import { Box } from "../Box/Box"
import SearchBar from "../SearchBar/SearchBar"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ReactComponent as LinkIcon } from "../../icons/link.svg"
import { ReactComponent as RemoveIcon } from "../../icons/close.svg"
import { Flex } from "../Flex/Flex"
import GuardianRelationshipPickerDialog from "../GuardianRelationshipPickerDialog/GuardianRelationshipPickerDialog"
import { usePostGuardianRelation } from "../../api/usePostGuardianRelation"
import { Link } from "../Link/Link"
import { Button } from "../Button/Button"
import { useDeleteGuardianRelation } from "../../api/useDeleteGuardianRelation"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

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
    <Box maxWidth="maxWidth.md" mx="auto">
      <BackNavigation
        to={STUDENT_PROFILE_URL(studentId)}
        text="Student Profile"
      />
      <Typography.H5 mx={3} mb={4} mt={3}>
        {student.data?.name}
      </Typography.H5>

      <Typography.Body mx={3} mb={2} color="textMediumEmphasis">
        Current guardians
      </Typography.Body>
      {(student.data?.guardians.length ?? 0) === 0 && (
        <Card borderRadius={[0, "default"]} mb={3} mx={[0, 3]}>
          <Typography.Body m={3} color="textMediumEmphasis" fontSize={1}>
            No guardians set yet
          </Typography.Body>
        </Card>
      )}
      {student.data?.guardians.map(
        (guardian) =>
          guardian && (
            <CurrentGuardiansCard guardian={guardian} studentId={studentId} />
          )
      )}
      <Card borderRadius={[0, "default"]} mb={2} mx={[0, 3]}>
        <Link to={NEW_GUARDIANS_URL(studentId)}>
          <Flex alignItems="center" p={3}>
            <Typography.Body lineHeight={1} fontSize={1}>
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
        Add existing guardian
      </Typography.Body>
      <Box px={3} pb={3} pt={2}>
        <SearchBar
          width="100%"
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
      <Card borderRadius={[0, "default"]} mb={2} mx={[0, 3]}>
        <Flex alignItems="center">
          <Box p={3}>
            <Typography.Body lineHeight={1} mb={2}>
              {guardian.name}
            </Typography.Body>
            <Typography.Body
              lineHeight={1}
              color="textMediumEmphasis"
              fontSize={1}
            >
              {guardian.email || "No email"}
            </Typography.Body>
          </Box>
          <Button
            mr={3}
            ml="auto"
            variant="outline"
            px={2}
            onClick={() => setShowDialog(true)}
          >
            <Icon as={RemoveIcon} m={0} fill="danger" />
          </Button>
        </Flex>
      </Card>
      {showDialog && (
        <Dialog>
          <Flex
            alignItems="center"
            backgroundColor="surface"
            py={1}
            sx={{ position: "relative" }}
          >
            <Typography.H6
              width="100%"
              sx={{
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
      <Card
        borderRadius={[0, "default"]}
        mb={2}
        mx={[0, 3]}
        onClick={() => setShowDialog(true)}
        sx={{
          cursor: "pointer",
        }}
      >
        <Flex alignItems="center">
          <Icon as={PlusIcon} m={0} ml={3} fill="primary" />
          <Box p={3}>
            <Typography.Body lineHeight={1} mb={2}>
              {guardian.name}
            </Typography.Body>
            <Typography.Body
              lineHeight={1}
              color="textMediumEmphasis"
              fontSize={1}
            >
              {guardian.email || "No email"}
            </Typography.Body>
          </Box>
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
