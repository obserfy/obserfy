import React, { FC, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import useGetPlan, { GetPlanResponseBody } from "../../api/plans/useGetPlan"
import useDeletePlans from "../../api/plans/useDeletePlan"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import BackNavigation from "../BackNavigation/BackNavigation"
import { STUDENT_PLANS_URL } from "../../routes"
import dayjs from "../../dayjs"
import Icon from "../Icon/Icon"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import AlertDialog from "../AlertDialog/AlertDialog"
import { navigate } from "../Link/Link"
import usePatchPlan from "../../api/plans/usePatchPlans"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import Chip from "../Chip/Chip"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import { Typography } from "../Typography/Typography"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"
import { ReactComponent as LinkIcon } from "../../icons/link.svg"
import useDeleteLessonPlanLink from "../../api/plans/useDeleteLessonPlanLink"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import LinkInput from "../LinkInput/LinkInput"
import usePostNewLessonPlanLink from "../../api/plans/usePostNewLessonPlanLink"

interface Props {
  studentId: string
  planId: string
}
export const PageStudentPlanDetails: FC<Props> = ({ studentId, planId }) => {
  const plan = useGetPlan(planId)
  const [deletePlan] = useDeletePlans(planId)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  if (plan.status === "loading") {
    return (
      <Box>
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ maxWidth: "maxWidth.sm" }} pb={3} mx="auto">
        <BackNavigation
          to={STUDENT_PLANS_URL(studentId, dayjs(plan.data?.date))}
          text="All plans"
        />
        <Card mb={3} sx={{ borderRadius: [0, "default"] }}>
          <DateDataBox value={plan.data?.date} lessonPlanId={planId} />
          <AreaDataBox value={plan.data?.areaId} lessonPlanId={planId} />
          <TitleDataBox value={plan.data?.title} lessonPlanId={planId} />
          <DescriptionDataBox
            value={plan.data?.description}
            lessonPlanId={planId}
          />
        </Card>
        <Card sx={{ borderRadius: [0, "default"] }}>
          <Typography.Body
            mt={3}
            mx={3}
            mb={1}
            color="textMediumEmphasis"
            sx={{ lineHeight: 1, fontSize: 1 }}
          >
            Links
          </Typography.Body>
          {plan.data?.links?.map((link) => {
            return (
              <LessonPlanLinks
                key={link.id}
                link={link}
                lessonPlanId={planId}
              />
            )
          })}
          <UrlField lessonPlanId={planId} />
        </Card>
        <Button
          variant="outline"
          m={3}
          ml="auto"
          onClick={() => setShowDeleteDialog(true)}
          color="danger"
        >
          <Icon as={TrashIcon} mr={2} fill="danger" />
          Delete
        </Button>
      </Box>
      {showDeleteDialog && (
        <AlertDialog
          title="Delete plan?"
          negativeText="Cancel"
          positiveText="Yes"
          body={`Are you sure you want to delete ${plan.data?.title}?`}
          onNegativeClick={() => setShowDeleteDialog(false)}
          onPositiveClick={async () => {
            const result = await deletePlan()
            if (result.ok) {
              await navigate(
                STUDENT_PLANS_URL(studentId, dayjs(plan.data?.date))
              )
            }
          }}
        />
      )}
    </>
  )
}

const DateDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  value,
  lessonPlanId,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [mutate] = usePatchPlan(lessonPlanId)

  return (
    <>
      <DataBox
        label="Date"
        onEditClick={() => setShowEditDialog(true)}
        value={value ? dayjs(value).format("D MMMM YYYY") : "N/A"}
      />
      {showEditDialog && (
        <DatePickerDialog
          defaultDate={dayjs(value)}
          onConfirm={async (date) => {
            await mutate({ date })
            setShowEditDialog(false)
          }}
          onDismiss={() => setShowEditDialog(false)}
        />
      )}
    </>
  )
}

const TitleDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  lessonPlanId,
  value,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [title, setTitle] = useState(value)
  const [mutate] = usePatchPlan(lessonPlanId)

  return (
    <>
      <DataBox
        label="Title"
        value={value ?? ""}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Edit Title"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={async () => {
              await mutate({ title })
              setShowEditDialog(false)
            }}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label="Title"
              sx={{ width: "100%" }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
        </Dialog>
      )}
    </>
  )
}

const DescriptionDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  value,
  lessonPlanId,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [description, setDescription] = useState(value)
  const [mutate] = usePatchPlan(lessonPlanId)

  return (
    <>
      <MultilineDataBox
        label="Description"
        value={value || ""}
        onEditClick={() => setShowEditDialog(true)}
        placeholder="-"
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Edit Description"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={async () => {
              await mutate({ description })
              setShowEditDialog(false)
            }}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <TextArea
              label="Description"
              sx={{ width: "100%", lineHeight: 1.8, minHeight: 400 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some description here"
            />
          </Box>
        </Dialog>
      )}
    </>
  )
}

const AreaDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  value,
  lessonPlanId,
}) => {
  const classes = useGetCurriculumAreas()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedArea, setSelectedArea] = useState(value)
  const [mutate] = usePatchPlan(lessonPlanId)

  return (
    <>
      <DataBox
        label="Related Area"
        value={classes.data?.find(({ id }) => id === value)?.name || "Other"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Change Area"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={async () => {
              await mutate({ areaId: selectedArea })
              setShowEditDialog(false)
            }}
          />
          <Flex
            sx={{ backgroundColor: "background", flexWrap: "wrap" }}
            p={3}
            pb={2}
          >
            {classes.data?.map(({ id, name }) => (
              <Chip
                mr={2}
                mb={2}
                key={id}
                text={name}
                activeBackground="primary"
                onClick={() => setSelectedArea(id)}
                isActive={id === selectedArea}
              />
            ))}
          </Flex>
        </Dialog>
      )}
    </>
  )
}

const DataBox: FC<{
  label: string
  value: string
  onEditClick?: () => void
}> = ({ label, value, onEditClick }) => (
  <Flex px={3} py={3} sx={{ alignItems: "flex-start" }}>
    <Box>
      <Typography.Body
        mb={1}
        color="textMediumEmphasis"
        sx={{ lineHeight: 1, fontSize: 1 }}
      >
        {label}
      </Typography.Body>
      <Typography.Body>{value}</Typography.Body>
    </Box>
    <Button
      variant="outline"
      ml="auto"
      px={2}
      onClick={onEditClick}
      sx={{ flexShrink: 0 }}
      aria-label={`edit-${label.toLowerCase()}`}
    >
      <Icon as={EditIcon} />
    </Button>
  </Flex>
)

const MultilineDataBox: FC<{
  label: string
  value: string
  onEditClick?: () => void
  placeholder: string
}> = ({ label, value, onEditClick, placeholder }) => (
  <Box px={3} py={3} sx={{ alignItems: "flex-start" }}>
    <Box mb={2}>
      <Typography.Body
        mb={1}
        color="textMediumEmphasis"
        sx={{ lineHeight: 1, fontSize: 1 }}
      >
        {label}
      </Typography.Body>
      {value.split("\n").map((text) => (
        <Typography.Body mb={3}>{text || placeholder}</Typography.Body>
      ))}
    </Box>
    <Button
      variant="outline"
      ml="auto"
      px={2}
      onClick={onEditClick}
      sx={{ flexShrink: 0, fontSize: 1, color: "textMediumEmphasis" }}
      aria-label={`edit-${label.toLowerCase()}`}
    >
      <Icon as={EditIcon} mr={2} />
      Edit {label.toLowerCase()}
    </Button>
  </Box>
)

const LessonPlanLinks: FC<{
  link: GetPlanResponseBody["links"][0]
  lessonPlanId: string
}> = ({ link, lessonPlanId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [deleteLink] = useDeleteLessonPlanLink(link.id, lessonPlanId)

  return (
    <Flex m={3} sx={{ alignItems: "center" }}>
      <Button
        variant="outline"
        sx={{ zIndex: 2, flexShrink: 0 }}
        px={2}
        onClick={() => window.open(link.url)}
      >
        <Icon as={LinkIcon} />
      </Button>
      <Box sx={{ whiteSpace: "nowrap", overflowX: "auto" }}>
        <Typography.Body sx={{ display: "inline-block" }} mx={2}>
          {link.url}
        </Typography.Body>
      </Box>
      <Button
        variant="outline"
        ml="auto"
        color="danger"
        px={2}
        backgroundColor="surface"
        sx={{ zIndex: 2, flexShrink: 0 }}
        onClick={async () => {
          setIsLoading(true)
          const result = await deleteLink()
          if (!result?.ok) {
            setIsLoading(false)
          }
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingIndicator ml={1} />
        ) : (
          <Icon as={TrashIcon} fill="danger" />
        )}
      </Button>
    </Flex>
  )
}

const UrlField: FC<{ lessonPlanId: string }> = ({ lessonPlanId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [postNewLink] = usePostNewLessonPlanLink(lessonPlanId)
  const [url, setUrl] = useState("")

  return (
    <LinkInput
      value={url}
      onChange={setUrl}
      m={3}
      isLoading={isLoading}
      onSave={async () => {
        setIsLoading(true)
        const result = await postNewLink({ url })
        if (result?.ok) {
          setUrl("")
        }
        setIsLoading(false)
      }}
    />
  )
}

export default PageStudentPlanDetails
