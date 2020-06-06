import React, { FC, useState } from "react"
import BackNavigation from "../BackNavigation/BackNavigation"
import { ALL_PLANS_URL } from "../../routes"
import { Typography } from "../Typography/Typography"
import { Box } from "../Box/Box"
import useGetPlan from "../../api/useGetPlan"
import Card from "../Card/Card"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import dayjs from "../../dayjs"
import DatePicker from "../DatePicker/DatePicker"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import AlertDialog from "../AlertDialog/AlertDialog"
import useDeletePlans from "../../api/useDeletePlan"
import { navigate } from "../Link/Link"

interface Props {
  id: string
}
export const PagePlanDetails: FC<Props> = ({ id }) => {
  const plan = useGetPlan(id)
  const [deletePlan] = useDeletePlans(id)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <Box maxWidth="maxWidth.sm" mx="auto">
        <BackNavigation to={ALL_PLANS_URL} text="All plans" />
        <Flex alignItems="center" m={3} mb={3}>
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
        <Card borderRadius={[0, "default"]}>
          <DateDataBox value={plan.data?.date} />
          <TitleDataBox value={plan.data?.title} />
          <DescriptionDataBox value={plan.data?.description} />
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
              await navigate(ALL_PLANS_URL)
            }
          }}
        />
      )}
    </>
  )
}

const TitleDataBox: FC<{ value?: string }> = ({ value }) => {
  const [showEditDialog, setShowEditDialog] = useState(false)

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
            onAccept={() => setShowEditDialog(false)}
          />
          <Box backgroundColor="background" p={3}>
            <Input label="Name" sx={{ width: "100%" }} value={value} />
          </Box>
        </Dialog>
      )}
    </>
  )
}

const DescriptionDataBox: FC<{ value?: string }> = ({ value }) => {
  const [showEditDialog, setShowEditDialog] = useState(false)

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
            onAccept={() => setShowEditDialog(false)}
          />
          <Box backgroundColor="background" p={3}>
            <Input label="Name" sx={{ width: "100%" }} value={value} />
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
        fontSize={0}
        lineHeight={1}
        mb={2}
        color="textMediumEmphasis"
      >
        {label}
      </Typography.Body>
      <Typography.Body fontSize={1} lineHeight={1}>
        {value}
      </Typography.Body>
    </Box>
    <Button
      variant="outline"
      ml="auto"
      px={2}
      onClick={onEditClick}
      sx={{ flexShrink: 0 }}
    >
      <Icon as={EditIcon} m={0} />
    </Button>
  </Flex>
)

const DateDataBox: FC<{ value?: string }> = ({ value }) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [date, setDate] = useState(dayjs(value || 0))

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
            onAccept={() => setShowEditDialog(false)}
          />
          <Flex p={3} backgroundColor="background">
            <DatePicker value={date} onChange={setDate} />
          </Flex>
        </Dialog>
      )}
    </>
  )
}

export default PagePlanDetails
