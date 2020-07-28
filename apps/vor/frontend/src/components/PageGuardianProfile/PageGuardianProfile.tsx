/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { Box, Button, Card, Flex, jsx } from "theme-ui"
import { useGetGuardian } from "../../api/guardians/useGetGuardian"
import { usePatchGuardian } from "../../api/guardians/usePatchGuardian"
import { ADMIN_GUARDIAN_URL } from "../../routes"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"

import BackNavigation from "../BackNavigation/BackNavigation"
import Dialog from "../Dialog/Dialog"
import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Typography from "../Typography/Typography"
import DialogHeader from "../DialogHeader/DialogHeader"

interface Props {
  guardianId: string
}
export const PageGuardianProfile: FC<Props> = ({ guardianId }) => {
  const { data, status } = useGetGuardian(guardianId)

  if (status === "loading") {
    return (
      <Box>
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={4}>
      <BackNavigation to={ADMIN_GUARDIAN_URL} text="All Guardians" />
      <Card sx={{ borderRadius: [0, "default"] }} mb={3}>
        <NameDataBox
          value={data?.name}
          key={`name${data?.name}`}
          guardianId={guardianId}
        />
        <EmailDataBox
          value={data?.email}
          key={`email${data?.email}`}
          guardianId={guardianId}
        />
        <PhoneDataBox
          value={data?.phone}
          key={`phone${data?.phone}`}
          guardianId={guardianId}
        />
        <NoteDataBox
          value={data?.note}
          key={`note${data?.note}`}
          guardianId={guardianId}
        />
      </Card>
    </Box>
  )
}

const NameDataBox: FC<{ value?: string; guardianId: string }> = ({
  value,
  guardianId,
}) => {
  const [mutate, { status }] = usePatchGuardian(guardianId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [name, setName] = useState(value)
  const saveName = async () => {
    await mutate({ id: guardianId, name })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label="Name"
        value={value ?? ""}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Edit Name"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveName}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label="Name"
              sx={{ width: "100%" }}
              onChange={(e) => {
                setName(e.target.value)
              }}
              value={name}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const EmailDataBox: FC<{ value?: string; guardianId: string }> = ({
  value,
  guardianId,
}) => {
  const [mutate, { status }] = usePatchGuardian(guardianId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [email, setEmail] = useState(value)
  const saveEmail = async () => {
    await mutate({ id: guardianId, email })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label="Email"
        value={value ?? ""}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Edit Email"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveEmail}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label="Email"
              sx={{ width: "100%" }}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              value={email}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const PhoneDataBox: FC<{ value?: string; guardianId: string }> = ({
  value,
  guardianId,
}) => {
  const [mutate, { status }] = usePatchGuardian(guardianId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [phone, setPhone] = useState(value)
  const savePhone = async () => {
    await mutate({ id: guardianId, phone })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label="Phone"
        value={value ?? ""}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Edit Phone"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={savePhone}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label="Phone"
              sx={{ width: "100%" }}
              onChange={(e) => {
                setPhone(e.target.value)
              }}
              value={phone}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const NoteDataBox: FC<{ value?: string; guardianId: string }> = ({
  value,
  guardianId,
}) => {
  const [mutate, { status }] = usePatchGuardian(guardianId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [note, setNote] = useState(value)
  const saveNote = async () => {
    await mutate({ id: guardianId, note })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label="Note"
        value={value ?? ""}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Edit Note"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveNote}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label="Note"
              sx={{ width: "100%" }}
              onChange={(e) => {
                setNote(e.target.value)
              }}
              value={note}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const DataBox: FC<{
  label: string
  value: string
  onEditClick?: () => void
}> = ({ label, value, onEditClick }) => (
  <Flex px={3} py={3} sx={{ alignItems: "center" }}>
    <Box>
      <Typography.Body
        sx={{ fontSize: 0, lineHeight: 1.4 }}
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
      aria-label={`edit-${label.toLowerCase()}`}
    >
      <Icon as={EditIcon} m={0} />
    </Button>
  </Flex>
)

export default PageGuardianProfile
