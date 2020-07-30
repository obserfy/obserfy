import React, { FC, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import BackNavigation from "../BackNavigation/BackNavigation"
import { ALL_PLANS_URL } from "../../routes"
import { Typography } from "../Typography/Typography"
import useGetPlan from "../../api/plans/useGetPlan"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import Icon from "../Icon/Icon"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import dayjs from "../../dayjs"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import AlertDialog from "../AlertDialog/AlertDialog"
import useDeletePlans from "../../api/plans/useDeletePlan"
import { navigate } from "../Link/Link"
import usePatchPlan from "../../api/plans/usePatchPlans"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import TextArea from "../TextArea/TextArea"
import useGetSchoolClasses from "../../api/classes/useGetSchoolClasses"
import Chip from "../Chip/Chip"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"

interface Props {
  id: string
}
export const PagePlanDetails: FC<Props> = ({ id }) => {
  const plan = useGetPlan(id)
  const [deletePlan] = useDeletePlans(id)
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
      <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
        <BackNavigation
          to={ALL_PLANS_URL(dayjs(plan.data?.date))}
          text="All plans"
        />
        <Card sx={{ borderRadius: [0, "default"] }}>
          <DateDataBox value={plan.data?.date} lessonPlanId={id} />
          <TitleDataBox value={plan.data?.title} lessonPlanId={id} />
          <DescriptionDataBox
            value={plan.data?.description}
            lessonPlanId={id}
          />
          <ClassDataBox value={plan.data?.classId} lessonPlanId={id} />
          <AreaDataBox value={plan.data?.areaId} lessonPlanId={id} />
        </Card>
        <Button
          variant="outline"
          mx={2}
          mt={3}
          ml="auto"
          onClick={() => setShowDeleteDialog(true)}
          color="danger"
        >
          <Icon as={TrashIcon} m={0} mr={2} fill="danger" />
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
              await navigate(ALL_PLANS_URL(dayjs(plan.data?.date)))
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
          <Box
            sx={{
              backgroundColor: "background",
            }}
            p={3}
          >
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
      <DataBox
        label="Description"
        value={value || "-"}
        onEditClick={() => setShowEditDialog(true)}
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
              sx={{ width: "100%" }}
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

const ClassDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  value,
  lessonPlanId,
}) => {
  const classes = useGetSchoolClasses()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedClass, setSelectedClass] = useState(value)
  const [mutate] = usePatchPlan(lessonPlanId)

  return (
    <>
      <DataBox
        label="Class"
        value={classes.data?.find(({ id }) => id === value)?.name || "-"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Change Class"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={async () => {
              await mutate({ classId: selectedClass })
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
                onClick={() => {
                  if (id === selectedClass) {
                    setSelectedClass("")
                  } else {
                    setSelectedClass(id)
                  }
                }}
                isActive={id === selectedClass}
              />
            ))}
          </Flex>
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
  <Flex
    px={3}
    py={3}
    sx={{
      borderBottomWidth: 1,
      borderBottomColor: "border",
      borderBottomStyle: "solid",
      alignItems: "flex-start",
    }}
  >
    <Box>
      <Typography.Body
        mb={2}
        color="textMediumEmphasis"
        sx={{ lineHeight: 1, fontSize: 1 }}
      >
        {label}
      </Typography.Body>
      <Typography.Body sx={{ lineHeight: 1 }}>{value}</Typography.Body>
    </Box>
    <Button
      variant="outline"
      ml="auto"
      px={2}
      onClick={onEditClick}
      sx={{ flexShrink: 0 }}
      aria-label={`edit-${label.toLowerCase()}`}
    >
      <Icon as={EditIcon} m={0} />
    </Button>
  </Flex>
)

export default PagePlanDetails
