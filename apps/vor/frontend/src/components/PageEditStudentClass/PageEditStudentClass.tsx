import React, { FC, useState } from "react"
import { BackNavigation } from "../BackNavigation/BackNavigation"
import { NEW_GUARDIANS_URL, STUDENT_PROFILE_URL } from "../../routes"
import Box from "../Box/Box"
import { useGetStudent } from "../../api/useGetStudent"
import useGetSchoolClasses from "../../api/classes/useGetSchoolClasses"
import { Typography } from "../Typography/Typography"
import { Card } from "../Card/Card"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import { Flex } from "../Flex/Flex"
import { Button } from "../Button/Button"
import Icon from "../Icon/Icon"
import { ReactComponent as RemoveIcon } from "../../icons/close.svg"
import { Link } from "../Link/Link"
import { ReactComponent as LinkIcon } from "../../icons/link.svg"
import SearchBar from "../SearchBar/SearchBar"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"

interface Props {
  studentId: string
}
export const PageEditStudentClass: FC<Props> = ({ studentId }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const student = useGetStudent(studentId)
  const classes = useGetSchoolClasses()

  const filteredClass = classes.data?.filter((currentClass) =>
    currentClass.name.toLowerCase().includes(searchTerm)
  )

  return (
    <Box mx="auto" maxWidth="maxWidth.sm">
      <BackNavigation
        text="Student Profile"
        to={STUDENT_PROFILE_URL(studentId)}
      />
      <Typography.H5 mx={3} mb={4} mt={3}>
        {student.data?.name}
      </Typography.H5>
      <Typography.Body mx={3} mb={2} color="textMediumEmphasis">
        Current classes
      </Typography.Body>
      {(student.data?.classes.length ?? 0) === 0 && (
        <Card borderRadius={[0, "default"]} mb={2} mx={[0, 3]}>
          <Typography.Body m={3} color="textMediumEmphasis" fontSize={1}>
            No classes selected yet
          </Typography.Body>
        </Card>
      )}
      {student.data?.classes.map(
        (currentClass) =>
          currentClass && (
            <CurrentClass
              key={`current${currentClass.id}`}
              name={currentClass.name}
            />
          )
      )}
      <Card borderRadius={[0, "default"]} mb={2} mx={[0, 3]}>
        <Link
          to={NEW_GUARDIANS_URL(studentId)}
          data-cy="new-guardian"
          style={{ display: "block" }}
        >
          <Flex alignItems="center" p={3}>
            <Typography.Body lineHeight={1} fontSize={1}>
              Create new class
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
        Select from existing class
      </Typography.Body>
      <Box px={3} pb={3} pt={2}>
        <SearchBar
          width="100%"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {filteredClass?.map((currentClass) => {
        return <OtherClass key={currentClass.id} name={currentClass.name} />
      })}
    </Box>
  )
}

const CurrentClass: FC<{ name: string }> = ({ name }) => {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <Card borderRadius={[0, "default"]} mb={2} mx={[0, 3]}>
        <Flex alignItems="center" py={3}>
          <Typography.Body lineHeight={1} ml={3}>
            {name}
          </Typography.Body>
          <Button
            mr={3}
            ml="auto"
            variant="outline"
            px={1}
            py={1}
            onClick={() => setShowDialog(true)}
            data-cy="remove-guardian"
          >
            <Icon as={RemoveIcon} m={0} fill="danger" />
          </Button>
        </Flex>
      </Card>
      {showDialog && (
        <Dialog>
          <DialogHeader
            title="Remove Class?"
            onAcceptText="Yes"
            onCancel={() => {
              setShowDialog(false)
            }}
          />
        </Dialog>
      )}
    </>
  )
}

const OtherClass: FC<{ name: string }> = ({ name }) => {
  return (
    <>
      <Card borderRadius={[0, "default"]} mb={2} mx={[0, 3]}>
        <Flex alignItems="center" py={3}>
          <Typography.Body lineHeight={1} ml={3}>
            {name}
          </Typography.Body>
          <Button
            ml="auto"
            mr={3}
            variant="outline"
            px={1}
            py={1}
            data-cy="remove-guardian"
          >
            <Icon as={PlusIcon} m={0} fill="primary" />
          </Button>
        </Flex>
      </Card>
    </>
  )
}

export default PageEditStudentClass
