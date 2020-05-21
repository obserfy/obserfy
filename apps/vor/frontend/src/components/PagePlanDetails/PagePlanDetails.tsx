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

interface Props {
  id: string
}
export const PagePlanDetails: FC<Props> = ({ id }) => {
  const plan = useGetPlan(id)

  return (
    <Box maxWidth="maxWidth.sm" mx="auto">
      <BackNavigation to={ALL_PLANS_URL} text="All plans" />
      <Typography.H5 m={3} mb={4}>
        {plan.data?.title}
      </Typography.H5>
      <Card borderRadius={[0, "default"]}>
        <DateDataBox value={plan.data?.date} />
        <DescriptionDataBox value={plan.data?.description} />
      </Card>
    </Box>
  )
}

const DescriptionDataBox: FC<{ value?: string }> = ({ value }) => {
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <>
      <DataBox
        label="Description"
        value={value ?? ""}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Edit Name"
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
        lineHeight={1.6}
        mb={1}
        color="textMediumEmphasis"
      >
        {label}
      </Typography.Body>
      <Typography.Body lineHeight={1.6}>{value}</Typography.Body>
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
            title="Edit Date of Entry"
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
