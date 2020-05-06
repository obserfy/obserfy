import React, { FC, useState } from "react"
import BackNavigation from "../BackNavigation/BackNavigation"
import {
  Guardians,
  useGetSchoolGuardians,
} from "../../api/useGetSchoolGuardians"
import { useGetStudent } from "../../api/useGetStudent"
import { Typography } from "../Typography/Typography"
import { Card } from "../Card/Card"
import { NEW_GUARDIANS_URL, STUDENT_PROFILE_URL } from "../../routes"
import { Box } from "../Box/Box"
import SearchBar from "../SearchBar/SearchBar"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { Flex } from "../Flex/Flex"
import GuardianRelationshipPickerDialog from "../GuardianRelationshipPickerDialog/GuardianRelationshipPickerDialog"
import { usePostGuardianRelation } from "../../api/usePostGuardianRelation"
import { Link } from "../Link/Link"

interface Props {
  id: string
}
export const PageEditGuardians: FC<Props> = ({ id }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const student = useGetStudent(id)
  const guardians = useGetSchoolGuardians()

  const filteredGuardians = guardians.data?.filter((guardian) => {
    return guardian.name.match(new RegExp(searchTerm, "i"))
  })

  return (
    <Box maxWidth="maxWidth.md" mx="auto">
      <BackNavigation to={STUDENT_PROFILE_URL(id)} text="Student Profile" />
      <Typography.H5 mx={3} mb={4} mt={3}>
        {student.data?.name}
      </Typography.H5>

      <Typography.Body mx={3} mb={2} color="textMediumEmphasis">
        Current guardians
      </Typography.Body>
      <Card borderRadius={[0, "default"]} mb={3} mx={[0, 3]}>
        <Typography.Body m={3} color="textMediumEmphasis" fontSize={1}>
          No guardians set yet
        </Typography.Body>
      </Card>
      <Typography.Body mx={3} mt={4} color="textMediumEmphasis">
        Select more
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
          <SelectGuardianCard
            key={guardian.id}
            studentId={id}
            guardian={guardian}
          />
        )
      })}
      <Card borderRadius={[0, "default"]} mb={2} mx={[0, 3]}>
        <Link to={NEW_GUARDIANS_URL(id)}>
          <Flex alignItems="center" p={3}>
            <Icon as={PlusIcon} m={0} mr={3} fill="primary" />
            <Typography.Body lineHeight={1}>
              Create a new guardian
            </Typography.Body>
          </Flex>
        </Link>
      </Card>
    </Box>
  )
}

const SelectGuardianCard: FC<{ guardian: Guardians; studentId: string }> = ({
  guardian,
  studentId,
}) => {
  const [showDialog, setShowDialog] = useState(false)
  const [mutate, { status }] = usePostGuardianRelation(guardian, studentId)

  return (
    <>
      <Card
        borderRadius={[0, "default"]}
        mb={2}
        mx={[0, 3]}
        onClick={() => setShowDialog(true)}
      >
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
      </Card>
      {showDialog && (
        <GuardianRelationshipPickerDialog
          loading={status === "loading"}
          onDismiss={() => setShowDialog(false)}
          onAccept={async (relationship) => {
            await mutate(relationship)
            if (status === "success") {
              setShowDialog(false)
            }
          }}
        />
      )}
    </>
  )
}

export default PageEditGuardians
