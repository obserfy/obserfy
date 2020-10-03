/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { Box, Button, Card, Flex, Image, jsx } from "theme-ui"
import { useImmer } from "use-immer"
import { nanoid } from "nanoid"
import { i18nMark } from "@lingui/core"
import { Trans } from "@lingui/macro"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import usePostNewPlan, {
  PostNewLessonPlanBody,
} from "../../api/plans/usePostNewPlan"
import dayjs from "../../dayjs"
import {
  ADMIN_CURRICULUM_URL,
  STUDENT_OVERVIEW_PAGE_URL,
  STUDENT_PLANS_URL,
  STUDENTS_URL,
} from "../../routes"
import { Typography } from "../Typography/Typography"
import DateInput from "../DateInput/DateInput"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import Chip from "../Chip/Chip"
import { navigate } from "../Link/Link"
import { useGetStudent } from "../../api/useGetStudent"
import { ReactComponent as LinkIcon } from "../../icons/link.svg"
import Icon from "../Icon/Icon"
import LinkInput from "../LinkInput/LinkInput"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import { ReactComponent as CheckmarkIcon } from "../../icons/checkmark-outline.svg"
import InformationalCard from "../InformationalCard/InformationalCard"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import {
  Student,
  useGetAllStudents,
} from "../../api/students/useGetAllStudents"
import StudentPicturePlaceholder from "../StudentPicturePlaceholder/StudentPicturePlaceholder"
import BackButton from "../BackButton/BackButton"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

interface Props {
  studentId: string
  chosenDate: string
}

export const PageNewStudentPlans: FC<Props> = ({ studentId, chosenDate }) => {
  const student = useGetStudent(studentId)
  const areas = useGetCurriculumAreas()
  const [mutate, { isLoading }] = usePostNewPlan()

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
    const result = await mutate({
      areaId,
      title,
      description,
      date,
      links,
      students: [studentId, ...otherStudentsId],
      repetition: repetition === 0 ? undefined : { type: repetition, endDate },
    })
    if (result?.ok) {
      await navigate(STUDENT_PLANS_URL(studentId, date))
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
            <BreadcrumbItem to={STUDENT_OVERVIEW_PAGE_URL(studentId)}>
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
            label="Title"
            sx={{ width: "100%" }}
            mb={2}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextArea
            label="Description"
            mb={4}
            value={description}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setDescription(e.target.value)
            }}
          />
        </Box>
        <Box mx={3} mb={4}>
          <Typography.H6 mb={2}>Links</Typography.H6>
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
              message={i18nMark(
                "You can enable the curriculum feature to track student progress in your curriculum."
              )}
              buttonText={i18nMark(" Go to Curriculum ")}
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
              text="None"
              activeBackground="primary"
              onClick={() => setRepetition(0)}
              isActive={repetition === 0}
            />
            <Chip
              mr={2}
              text="Daily"
              activeBackground="primary"
              onClick={() => setRepetition(1)}
              isActive={repetition === 1}
            />
            <Chip
              mr={2}
              text="Weekly"
              activeBackground="primary"
              onClick={() => setRepetition(2)}
              isActive={repetition === 2}
            />
          </Flex>
          {repetition > 0 && (
            <Box mt={3}>
              <DateInput
                label="Repeat Until"
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
                variant="secondary"
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
          sx={{
            whiteSpace: "nowrap",
            display: "inline-block",
          }}
        >
          {link.url}
        </Typography.Body>
      </a>

      <Button
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

const StudentPickerDialog: FC<{
  filteredIds: string[]
  onDismiss: () => void
  onAccept: (student: Student[]) => void
}> = ({ filteredIds, onDismiss, onAccept }) => {
  const allStudents = useGetAllStudents("", true)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useImmer<Student[]>([])

  const unselectedStudents = allStudents.data?.filter((student) => {
    return filteredIds.findIndex((id) => student.id === id) === -1
  })

  const matched = unselectedStudents?.filter((student) => {
    return student.name.match(new RegExp(search, "i"))
  })

  return (
    <Dialog>
      <DialogHeader
        onAcceptText={i18nMark("Add")}
        title={i18nMark("Select Students")}
        onCancel={onDismiss}
        onAccept={() => {
          onAccept(selected)
          onDismiss()
        }}
        disableAccept={selected.length === 0}
      />
      <Box
        pt={3}
        sx={{
          maxHeight: 300,
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Input
          mx={3}
          mb={3}
          sx={{ backgroundColor: "background", width: "100%" }}
          placeholder="Search student"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {unselectedStudents?.length === 0 && (
          <Typography.Body m={3} sx={{ width: "100%", textAlign: "center" }}>
            <Trans>No more students to add</Trans>
          </Typography.Body>
        )}
        {matched?.map((student) => {
          const isSelected =
            selected.findIndex(({ id }) => id === student.id) !== -1

          return (
            <Flex
              key={student.id}
              pl={3}
              sx={{
                alignItems: "center",
                cursor: "pointer",
                borderBottomStyle: "solid",
                borderBottomWidth: 1,
                borderBottomColor: "border",
              }}
              onClick={() => {
                if (!isSelected) {
                  setSelected((draft) => {
                    draft.push(student)
                  })
                } else {
                  setSelected((draft) => {
                    return draft.filter(({ id }) => id !== student.id)
                  })
                }
              }}
            >
              <Typography.Body p={3} sx={{ width: "100%" }}>
                {student.name}
              </Typography.Body>
              {isSelected && (
                <Icon mr={3} as={CheckmarkIcon} fill="primaryDark" />
              )}
            </Flex>
          )
        })}
      </Box>
    </Dialog>
  )
}

export default PageNewStudentPlans
