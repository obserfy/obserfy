import { FC, useState } from "react"
import { Button, Box, Card, Flex } from "theme-ui"
import { t, Trans } from "@lingui/macro"
import { BackNavigation } from "../BackNavigation/BackNavigation"
import { NEW_STUDENT_CLASS_URL, STUDENT_PROFILE_URL } from "../../routes"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import useGetSchoolClasses from "../../hooks/api/classes/useGetSchoolClasses"
import { Typography } from "../Typography/Typography"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Icon from "../Icon/Icon"
import { ReactComponent as RemoveIcon } from "../../icons/close.svg"
import { Link } from "../Link/Link"
import { ReactComponent as LinkIcon } from "../../icons/link.svg"
import SearchBar from "../SearchBar/SearchBar"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import usePostStudentClassRelation from "../../hooks/api/students/usePostStudentClassRelation"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import useDeleteStudentClassRelation from "../../hooks/api/students/useDeleteStudentClassRelation"

interface Props {
  studentId: string
}
export const PageEditStudentClass: FC<Props> = ({ studentId }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const student = useGetStudent(studentId)
  const classes = useGetSchoolClasses()

  const filteredClass = classes.data?.filter(
    (currentClass) =>
      currentClass.name.match(new RegExp(searchTerm, "i")) &&
      !student.data?.classes.map(({ id }) => id).includes(currentClass.id)
  )

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
      <BackNavigation
        text="Student Profile"
        to={STUDENT_PROFILE_URL(studentId)}
      />
      <Typography.H5 mx={3} mt={3} color="textDisabled">
        {student.data?.name}
      </Typography.H5>
      <Typography.H5 mx={3} mb={3}>
        <Trans>Edit Classes</Trans>
      </Typography.H5>
      <Typography.Body mx={3} mb={2} color="textMediumEmphasis">
        <Trans>Current classes</Trans>
      </Typography.Body>
      {(student.data?.classes.length ?? 0) === 0 && (
        <Card sx={{ borderRadius: [0, "default"] }} mb={2} mx={[0, 3]}>
          <Typography.Body p={3} color="textMediumEmphasis">
            <Trans>No classes selected yet</Trans>
          </Typography.Body>
        </Card>
      )}
      {student.data?.classes.map(
        (currentClass) =>
          currentClass && (
            <CurrentClass
              key={`current${currentClass.id}`}
              name={currentClass.name}
              classId={currentClass.id}
              studentId={studentId}
            />
          )
      )}
      <Card sx={{ borderRadius: [0, "default"] }} mb={2} mx={[0, 3]}>
        <Link
          to={NEW_STUDENT_CLASS_URL(studentId)}
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
              <Trans>Create new class</Trans>
            </Typography.Body>
            <Icon as={LinkIcon} ml="auto" mr={2} fill="textMediumEmphasis" />
          </Flex>
        </Link>
      </Card>
      <Typography.Body mx={3} mt={4} color="textMediumEmphasis">
        <Trans>Select from existing class</Trans>
      </Typography.Body>
      <Box px={3} pb={3} pt={2}>
        <SearchBar
          sx={{ width: "100%" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {filteredClass?.map((currentClass) => {
        return (
          <OtherClass
            key={currentClass.id}
            name={currentClass.name}
            classId={currentClass.id}
            studentId={studentId}
          />
        )
      })}
    </Box>
  )
}

const CurrentClass: FC<{
  studentId: string
  classId: string
  name: string
}> = ({ studentId, classId, name }) => {
  const { mutateAsync, isLoading } = useDeleteStudentClassRelation(studentId)
  const [showDialog, setShowDialog] = useState(false)

  const handleRemove = async () => {
    try {
      await mutateAsync(classId)
      setShowDialog(false)
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <>
      <Card variant="responsive" mb={2}>
        <Flex sx={{ alignItems: "center" }} py={3}>
          <Typography.Body ml={3}>{name}</Typography.Body>
          <Button
            mr={3}
            ml="auto"
            variant="outline"
            p={1}
            onClick={() => setShowDialog(true)}
            data-cy="remove-class"
          >
            <Icon as={RemoveIcon} fill="danger" />
          </Button>
        </Flex>
      </Card>
      {showDialog && (
        <Dialog>
          <DialogHeader
            title={t`Remove Class?`}
            onAcceptText={t`Yes`}
            loading={isLoading}
            onAccept={handleRemove}
            onCancel={() => setShowDialog(false)}
          />
          <Typography.Body p={3} sx={{ backgroundColor: "background" }}>
            <Trans>Are you sure you want to remove {name}?</Trans>
          </Typography.Body>
        </Dialog>
      )}
    </>
  )
}

const OtherClass: FC<{ studentId: string; classId: string; name: string }> = ({
  classId,
  studentId,
  name,
}) => {
  const { mutateAsync, isLoading } = usePostStudentClassRelation(studentId)

  const handleAddClass = async () => {
    try {
      await mutateAsync(classId)
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <>
      <Card variant="responsive" mb={2}>
        <Flex sx={{ alignItems: "center" }} py={3}>
          <Typography.Body ml={3}>{name}</Typography.Body>
          <Button
            ml="auto"
            mr={3}
            variant="outline"
            p={1}
            data-cy="add-class"
            onClick={handleAddClass}
          >
            {isLoading ? (
              <LoadingIndicator ml={2} />
            ) : (
              <Icon as={PlusIcon} fill="primary" />
            )}
          </Button>
        </Flex>
      </Card>
    </>
  )
}

export default PageEditStudentClass
