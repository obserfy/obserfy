/** @jsx jsx */
import { FC, useState } from "react"
import { Box, Button, Card, Flex, jsx } from "theme-ui"
import { useImmer } from "use-immer"
import { nanoid } from "nanoid"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import usePostNewPlan, {
  PostNewLessonPlanBody,
} from "../../api/plans/usePostNewPlan"
import dayjs from "../../dayjs"
import BackNavigation from "../BackNavigation/BackNavigation"
import { ADMIN_CURRICULUM_URL, STUDENT_PLANS_URL } from "../../routes"
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
import InformationalCard from "../InformationalCard/InformationalCard"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import {
  Student,
  useGetAllStudents,
} from "../../api/students/useGetAllStudents"

interface Props {
  studentId: string
  chosenDate: string
}

export const PageNewStudentPlans: FC<Props> = ({ studentId, chosenDate }) => {
  const student = useGetStudent(studentId)
  const areas = useGetCurriculumAreas()
  const [mutate] = usePostNewPlan()

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
    if (result.ok) {
      await navigate(STUDENT_PLANS_URL(studentId, date))
    }
  }

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <BackNavigation
        to={STUDENT_PLANS_URL(studentId, date)}
        text="All plans"
      />
      <Typography.H5 mx={3} mt={3} color="textDisabled">
        {student.data?.name}
      </Typography.H5>
      <Typography.H5 mx={3} mb={4}>
        New Plan
      </Typography.H5>
      <Box mx={3}>
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
      {areas.status === "success" && areas.data.length === 0 ? (
        <Box mx={[0, 3]}>
          <InformationalCard
            message="You can enable the curriculum feature to track student progress in your curriculum."
            buttonText=" Go to Curriculum "
            to={ADMIN_CURRICULUM_URL}
          />
        </Box>
      ) : (
        <Box mx={3} mb={4}>
          <Typography.H6 mb={2}>Related Area</Typography.H6>
          <Flex mb={2} sx={{ flexWrap: "wrap" }}>
            {areas.data?.map(({ id, name }) => (
              <Chip
                mb={2}
                mr={2}
                key={id}
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
        <Typography.H6 mb={2}>Repetition</Typography.H6>
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

      <Box mx={3}>
        <Flex sx={{ alignItems: "baseline" }} mb={2}>
          <Typography.H6>Other Students</Typography.H6>
          <Button
            ml="auto"
            variant="outline"
            onClick={() => setShowStudentPickerDialog(true)}
          >
            Add
          </Button>
        </Flex>
        <Box>
          {otherStudents.map((otherStudent) => (
            <Box>{otherStudent.name}</Box>
          ))}
        </Box>
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

      <Box mx={3} mb={4}>
        <Button
          disabled={title === ""}
          mt={3}
          sx={{ width: "100%" }}
          onClick={postNewPlan}
        >
          Save
        </Button>
      </Box>
    </Box>
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

  const matched = allStudents.data
    ?.filter((student) => student.name.match(new RegExp(search, "i")))
    ?.filter((student) => {
      return filteredIds.findIndex((id) => student.id === id) === -1
    })

  return (
    <Dialog>
      <DialogHeader
        onAcceptText="Add"
        title="Add More Student"
        onCancel={onDismiss}
        onAccept={() => {
          onAccept(selected)
          onDismiss()
        }}
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
          sx={{ backgroundColor: "background", width: "100%" }}
          placeholder="Search student"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {matched?.map((student) => {
          const isSelected =
            selected.findIndex(({ id }) => id === student.id) !== -1

          return (
            <Flex
              sx={{ backgroundColor: isSelected ? "primary" : "surface" }}
              p={3}
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
              <Typography.Body>{student.name}</Typography.Body>
            </Flex>
          )
        })}
      </Box>
    </Dialog>
  )
}

export default PageNewStudentPlans
