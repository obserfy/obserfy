import { t, Trans } from "@lingui/macro"
import { nanoid } from "nanoid"
import { FC, Fragment, useState } from "react"
import { Box, Button, Card, Flex, Image } from "theme-ui"
import { useImmer } from "use-immer"
import { borderFull } from "../../border"
import dayjs from "../../dayjs"
import usePostNewPlan, {
  PostNewLessonPlanBody,
} from "../../hooks/api/plans/usePostNewPlan"
import { Student } from "../../hooks/api/students/useGetAllStudents"
import { useGetCurriculumAreas } from "../../hooks/api/useGetCurriculumAreas"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import { ReactComponent as LinkIcon } from "../../icons/link.svg"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import {
  ADMIN_CURRICULUM_URL,
  STUDENT_OVERVIEW_URL,
  STUDENT_PLANS_URL,
  STUDENTS_URL,
} from "../../routes"
import BackButton from "../BackButton/BackButton"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"
import Chip from "../Chip/Chip"
import DateInput from "../DateInput/DateInput"
import Icon from "../Icon/Icon"
import InformationalCard from "../InformationalCard/InformationalCard"
import Input from "../Input/Input"
import { navigate } from "../Link/Link"
import LinkInput from "../LinkInput/LinkInput"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor"
import StudentPickerDialog from "../StudentPickerDialog/StudentPickerDialog"
import StudentPicturePlaceholder from "../StudentPicturePlaceholder/StudentPicturePlaceholder"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import { Typography } from "../Typography/Typography"

interface Props {
  studentId: string
  chosenDate: string
}

export const PageNewStudentPlans: FC<Props> = ({ studentId, chosenDate }) => {
  const student = useGetStudent(studentId)
  const areas = useGetCurriculumAreas()
  const { mutateAsync, isLoading } = usePostNewPlan()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [areaId, setAreaId] = useState("")
  const [date, setDate] = useState(chosenDate ? dayjs(chosenDate) : dayjs())
  const [links, setLinks] = useImmer<PostNewLessonPlanBody["links"]>([])
  const [showStudentPickerDialog, setShowStudentPickerDialog] = useState(false)
  const [otherStudents, setOtherStudents] = useImmer<Student[]>([])
  const otherStudentsId = otherStudents.map(({ id }) => id)

  // Repetition data
  const [repetition, setRepetition] = useState(0)
  const [endDate, setEndDate] = useState(date)

  async function postNewPlan() {
    try {
      await mutateAsync({
        areaId,
        title,
        description,
        date,
        links,
        students: [studentId, ...otherStudentsId],
        repetition:
          repetition === 0 ? undefined : { type: repetition, endDate },
      })
      await navigate(STUDENT_PLANS_URL(studentId, date))
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Fragment>
      <TranslucentBar
        boxSx={{
          position: "sticky",
          top: 0,
          borderBottomWidth: 1,
          borderBottomColor: "borderSolid",
          borderBottomStyle: "solid",
        }}
      >
        <Flex sx={{ alignItems: "center", maxWidth: "maxWidth.sm" }} m="auto">
          <BackButton to={STUDENT_PLANS_URL(studentId, date)} />
          <Breadcrumb>
            <BreadcrumbItem to={STUDENTS_URL}>Students</BreadcrumbItem>
            <BreadcrumbItem to={STUDENT_OVERVIEW_URL(studentId)}>
              {student.data?.name.split(" ")[0]}
            </BreadcrumbItem>
            <BreadcrumbItem to={STUDENT_PLANS_URL(studentId, date)}>
              <Trans>Plans</Trans>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Trans>New</Trans>
            </BreadcrumbItem>
          </Breadcrumb>
          <Button
            ml="auto"
            my={2}
            mr={3}
            onClick={postNewPlan}
            disabled={title === ""}
            p={isLoading ? 1 : 2}
          >
            {isLoading ? <LoadingIndicator size={22} /> : "Save"}
          </Button>
        </Flex>
      </TranslucentBar>
      <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
        <Box mx={3} mt={2}>
          <DateInput label="Date" value={date} onChange={setDate} mb={2} />
          <Input
            label={t`Title`}
            sx={{ width: "100%" }}
            mb={3}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Card sx={{ ...borderFull }} mb={3}>
            <Typography.Body p={3} sx={{ fontWeight: "bold" }}>
              <Trans>Description</Trans>
            </Typography.Body>
            <MarkdownEditor onChange={setDescription} value={description} />
          </Card>
        </Box>

        <Box mx={3} mb={4}>
          <Typography.H6 mb={2}>
            <Trans>Links</Trans>
          </Typography.H6>
          {links.map((link) => (
            <LinkPreview
              key={link.id}
              link={link}
              onDelete={(id) => {
                setLinks((draft) => draft.filter((item) => item.id !== id))
              }}
            />
          ))}
          <UrlField
            onSave={(url) => {
              setLinks((draft) => {
                draft.push({ id: nanoid(), url })
                return draft
              })
            }}
          />
        </Box>

        {areas.status === "success" && (areas.data?.length ?? 0) === 0 ? (
          <Box mx={[0, 3]}>
            <InformationalCard
              message={t`
                You can enable the curriculum feature to track student progress in your curriculum.
              `}
              buttonText={t` Go to Curriculum `}
              to={ADMIN_CURRICULUM_URL}
            />
          </Box>
        ) : (
          <Box mx={3} mb={4}>
            <Typography.H6 mb={2}>
              <Trans>Related Area</Trans>
            </Typography.H6>
            <Flex mb={2} sx={{ flexWrap: "wrap" }}>
              {areas.data?.map(({ id, name }) => (
                <Chip
                  key={id}
                  mb={2}
                  mr={2}
                  text={name}
                  activeBackground="primary"
                  onClick={() => setAreaId(id === areaId ? "" : id)}
                  isActive={id === areaId}
                />
              ))}
            </Flex>
          </Box>
        )}

        <Box mx={3} mb={4}>
          <Typography.H6 mb={2}>
            <Trans>Repetition</Trans>
          </Typography.H6>
          <Flex>
            <Chip
              mr={2}
              text={t`None`}
              activeBackground="primary"
              onClick={() => setRepetition(0)}
              isActive={repetition === 0}
            />
            <Chip
              mr={2}
              text={t`Daily`}
              activeBackground="primary"
              onClick={() => setRepetition(1)}
              isActive={repetition === 1}
            />
            <Chip
              mr={2}
              text={t`Weekly`}
              activeBackground="primary"
              onClick={() => setRepetition(2)}
              isActive={repetition === 2}
            />
          </Flex>
          {repetition > 0 && (
            <Box mt={3}>
              <DateInput
                label={t`Repeat Until`}
                value={endDate}
                onChange={setEndDate}
                mb={2}
              />
            </Box>
          )}
        </Box>

        <Box mx={3} mb={4}>
          <Flex sx={{ alignItems: "flex-end" }} mb={2}>
            <Typography.H6>
              <Trans>Other Related Students</Trans>
            </Typography.H6>
            <Button
              data-cy="add-student"
              ml="auto"
              variant="outline"
              onClick={() => setShowStudentPickerDialog(true)}
            >
              <Trans>Add</Trans>
            </Button>
          </Flex>
          {otherStudents.map((otherStudent) => (
            <Flex key={otherStudent.id} my={3} sx={{ alignItems: "center" }}>
              <Box sx={{ flexShrink: 0 }}>
                {otherStudent.profileImageUrl ? (
                  <Image
                    src={otherStudent.profileImageUrl}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "circle",
                    }}
                  />
                ) : (
                  <StudentPicturePlaceholder />
                )}
              </Box>
              <Typography.Body ml={3} sx={{ width: "100%" }}>
                {otherStudent.name}
              </Typography.Body>
              <Button
                data-cy="delete-student"
                variant="text"
                onClick={() =>
                  setOtherStudents((draft) => {
                    return draft.filter(({ id }) => id !== otherStudent.id)
                  })
                }
              >
                <Icon as={TrashIcon} fill="danger" />
              </Button>
            </Flex>
          ))}
          {otherStudents.length === 0 && (
            <Typography.Body
              mx={3}
              my={4}
              sx={{ textAlign: "center", color: "textMediumEmphasis" }}
            >
              <Trans>No other students added yet.</Trans>
            </Typography.Body>
          )}
          {showStudentPickerDialog && (
            <StudentPickerDialog
              filteredIds={[studentId, ...otherStudentsId]}
              onDismiss={() => setShowStudentPickerDialog(false)}
              onAccept={(students) =>
                setOtherStudents((draft) => [...draft, ...students])
              }
            />
          )}
        </Box>
      </Box>
    </Fragment>
  )
}

const UrlField: FC<{ onSave: (url: string) => void }> = ({ onSave }) => {
  const [url, setUrl] = useState("")

  return (
    <LinkInput
      value={url}
      onChange={setUrl}
      inputSx={{ p: 2 }}
      onSave={() => {
        onSave(url)
        setUrl("")
      }}
    />
  )
}

const LinkPreview: FC<{
  link: PostNewLessonPlanBody["links"][0]
  onDelete: (id: string) => void
}> = ({ link, onDelete }) => (
  <Card mb={2} sx={{ overflow: "inherit" }}>
    <Flex sx={{ alignItems: "center" }}>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex",
          alignItems: "center",
          overflowX: ["auto", "hidden"],
          "&:hover": {
            textDecoration: "underline",
            color: "onSurface",
          },
        }}
      >
        <Icon as={LinkIcon} ml={3} my={3} />
        <Typography.Body
          ml={2}
          sx={{ whiteSpace: "nowrap", display: "inline-block" }}
        >
          {link.url}
        </Typography.Body>
      </a>

      <Button
        data-cy="delete-link"
        variant="outline"
        ml="auto"
        color="danger"
        px={2}
        backgroundColor="surface"
        sx={{ zIndex: 2, flexShrink: 0 }}
        mr={2}
        onClick={() => onDelete(link.id)}
      >
        <Icon as={TrashIcon} fill="danger" />
      </Button>
    </Flex>
  </Card>
)

export default PageNewStudentPlans
