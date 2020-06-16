import React, { FC, useState } from "react"
import { Flex, Button, Card, Box } from "theme-ui"
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
import DatePicker from "../DatePicker/DatePicker"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import AlertDialog from "../AlertDialog/AlertDialog"
import useDeletePlans from "../../api/plans/useDeletePlan"
import { navigate } from "../Link/Link"
import usePatchPlan from "../../api/plans/usePatchPlans"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import TextArea from "../TextArea/TextArea"

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
        <Flex sx={{ alignItems: "center" }} m={3} mb={3}>
          <Typography.H5>{plan.data?.title}</Typography.H5>
          <Button
            variant="outline"
            px={2}
            ml="auto"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Icon as={TrashIcon} m={0} fill="danger" />
          </Button>
        </Flex>
        <Card sx={{ borderRadius: [0, "default"] }}>
          <DateDataBox value={plan.data?.date} id={id} />
          <TitleDataBox value={plan.data?.title} id={id} />
          <DescriptionDataBox value={plan.data?.description} id={id} />
        </Card>
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

const DateDataBox: FC<{ value?: string; id: string }> = ({ value, id }) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [date, setDate] = useState(dayjs(value || 0))
  const [mutate] = usePatchPlan(id)

  return (
    <>
      <DataBox
        label="Date"
        onEditClick={() => setShowEditDialog(true)}
        value={value ? dayjs(value).format("D MMMM YYYY") : "N/A"}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Edit Date"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={async () => {
              await mutate({ date: date.startOf("day") })
              setShowEditDialog(false)
            }}
          />
          <Flex
            p={3}
            sx={{
              backgroundColor: "background",
            }}
          >
            <DatePicker value={date} onChange={setDate} />
          </Flex>
        </Dialog>
      )}
    </>
  )
}

const TitleDataBox: FC<{ value?: string; id: string }> = ({ id, value }) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [title, setTitle] = useState(value)
  const [mutate] = usePatchPlan(id)

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

const DescriptionDataBox: FC<{ value?: string; id: string }> = ({
  value,
  id,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [description, setDescription] = useState(value)
  const [mutate] = usePatchPlan(id)

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
          <Box
            sx={{
              backgroundColor: "background",
            }}
            p={3}
          >
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
        sx={{
          lineHeight: 1,
          fontSize: 0,
        }}
      >
        {label}
      </Typography.Body>
      <Typography.Body
        sx={{
          fontSize: 1,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography.Body>
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
