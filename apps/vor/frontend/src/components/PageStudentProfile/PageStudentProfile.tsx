/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { Box, Button, Card, Flex, jsx } from "theme-ui"

import BackNavigation from "../BackNavigation/BackNavigation"
import { useGetStudent } from "../../api/useGetStudent"
import { usePatchStudentApi } from "../../api/students/usePatchStudentApi"

import Typography from "../Typography/Typography"
import {
  EDIT_GUARDIANS_URL,
  EDIT_STUDENT_CLASS_URL,
  STUDENT_OVERVIEW_PAGE_URL,
} from "../../routes"
import dayjs from "../../dayjs"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import Icon from "../Icon/Icon"
import Dialog from "../Dialog/Dialog"
import Input from "../Input/Input"
import DialogHeader from "../DialogHeader/DialogHeader"
import { Gender } from "../../api/students/usePostNewStudent"
import Select from "../Select/Select"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { Link } from "../Link/Link"
import AlertDialog from "../AlertDialog/AlertDialog"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"

interface Props {
  id: string
}
export const PageStudentProfile: FC<Props> = ({ id }) => {
  const { data, status } = useGetStudent(id)

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
      <BackNavigation
        to={STUDENT_OVERVIEW_PAGE_URL(id)}
        text="Student Overview"
      />
      <Card sx={{ borderRadius: [0, "default"] }} mb={3}>
        <NameDataBox
          value={data?.name}
          key={`name${data?.name}`}
          studentId={id}
        />
        <GenderDataBox
          value={data?.gender}
          key={`gender${data?.gender}`}
          studentId={id}
        />
        <StudentIdDataBox
          value={data?.customId}
          key={`id${data?.customId}`}
          studentId={id}
        />
        <DateOfBirthDataBox
          value={data?.dateOfBirth}
          key={`dob${data?.dateOfBirth}`}
          studentId={id}
        />
        <DateOfEntryDataBox
          value={data?.dateOfEntry}
          key={`doe${data?.dateOfEntry}`}
          studentId={id}
        />
      </Card>

      <Card sx={{ borderRadius: [0, "default"] }} mb={3}>
        <Flex sx={{ alignItems: "flex-start" }}>
          <Box px={3} py={3}>
            <Typography.Body
              sx={{
                fontSize: 0,
                lineHeight: 1,
              }}
              mb={2}
              color="textMediumEmphasis"
            >
              Classes
            </Typography.Body>
            {data?.classes?.length === 0 && (
              <Typography.Body
                sx={{
                  lineHeight: 1,
                }}
              >
                Not set
              </Typography.Body>
            )}
            {data?.classes?.map((currentClass) => (
              <Typography.Body
                sx={{ lineHeight: 1 }}
                key={currentClass.id}
                mt={3}
              >
                {currentClass.name}
              </Typography.Body>
            ))}
          </Box>

          <Link
            to={EDIT_STUDENT_CLASS_URL(id)}
            sx={{ ml: "auto", mt: 3, mr: 3 }}
            data-cy="edit-classes"
          >
            <Button variant="outline" ml="auto" px={2}>
              <Icon as={EditIcon} m={0} />
            </Button>
          </Link>
        </Flex>
      </Card>

      <Card sx={{ borderRadius: [0, "default"] }}>
        <Flex sx={{ alignItems: "flex-start" }}>
          <Box px={3} pt={3}>
            <Typography.Body
              sx={{
                fontSize: 0,
                lineHeight: 1,
              }}
              color="textMediumEmphasis"
            >
              Guardians
            </Typography.Body>
            {data?.guardians?.length === 0 && (
              <Typography.Body sx={{ lineHeight: 1 }} mb={3} mt={2}>
                Not set
              </Typography.Body>
            )}
            {data?.guardians?.map(({ email, name }) => {
              return (
                <Box py={3}>
                  <Typography.Body sx={{ lineHeight: 1 }} mb={2}>
                    {name}
                  </Typography.Body>
                  <Typography.Body
                    sx={{ lineHeight: 1, fontSize: 1 }}
                    color="textMediumEmphasis"
                  >
                    {email || "No email"}
                  </Typography.Body>
                </Box>
              )
            })}
          </Box>
          <Link
            to={EDIT_GUARDIANS_URL(id)}
            sx={{ ml: "auto", mt: 3, mr: 3 }}
            data-cy="edit-guardians"
          >
            <Button variant="outline" px={2}>
              <Icon as={EditIcon} m={0} />
            </Button>
          </Link>
        </Flex>
      </Card>
      <Box mt={3}>
        <SetStatusDataBox
          studentId={id}
          active={data?.active ?? false}
          name={data?.name ?? ""}
        />
      </Box>
    </Box>
  )
}

const NameDataBox: FC<{ value?: string; studentId: string }> = ({
  value,
  studentId,
}) => {
  const [mutate, { status }] = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [name, setName] = useState(value)
  const saveName = async () => {
    await mutate({ id: studentId, name })
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

const GenderDataBox: FC<{ value?: number; studentId: string }> = ({
  value,
  studentId,
}) => {
  const [mutate, { status }] = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [gender, setGender] = useState(value)
  const saveGender = async () => {
    await mutate({ id: studentId, gender })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label="Gender"
        onEditClick={() => setShowEditDialog(true)}
        value={(() => {
          switch (gender) {
            case 1:
              return "Male"
            case 2:
              return "Female"
            default:
              return "Not set"
          }
        })()}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Edit Gender"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveGender}
            loading={status === "loading"}
          />
          <Box
            sx={{
              backgroundColor: "background",
            }}
            p={3}
          >
            <Select
              label="Gender"
              value={gender}
              onChange={(e) => {
                setGender(parseInt(e.target.value, 10))
              }}
            >
              <option value={Gender.NotSet}>Not Set</option>
              <option value={Gender.Male}>Male</option>
              <option value={Gender.Female}>Female</option>
            </Select>
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const StudentIdDataBox: FC<{ value?: string; studentId: string }> = ({
  value,
  studentId,
}) => {
  const [mutate, { status }] = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [customId, setCustomId] = useState(value)
  const saveCustomId = async () => {
    await mutate({ id: studentId, customId })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label="Student ID"
        value={customId || "Not set"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Edit Student ID"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveCustomId}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label="Student ID"
              sx={{ width: "100%" }}
              value={customId}
              onChange={(e) => {
                setCustomId(e.target.value)
              }}
              placeholder="Type an ID"
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

// TODO: The two components below looks similar, consider refactoring
const DateOfBirthDataBox: FC<{ value?: string; studentId: string }> = ({
  value,
  studentId,
}) => {
  const [mutate] = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <Fragment>
      <DataBox
        label="Date of Birth"
        value={value ? dayjs(value).format("D MMMM YYYY") : "N/A"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <DatePickerDialog
          defaultDate={dayjs(value)}
          onConfirm={async (date) => {
            await mutate({
              id: studentId,
              dateOfBirth: date,
            })
            setShowEditDialog(false)
          }}
          onDismiss={() => setShowEditDialog(false)}
        />
      )}
    </Fragment>
  )
}

const DateOfEntryDataBox: FC<{ value?: string; studentId: string }> = ({
  value,
  studentId,
}) => {
  const [mutate] = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <Fragment>
      <DataBox
        label="Date of Entry"
        value={value ? dayjs(value).format("D MMMM YYYY") : "N/A"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <DatePickerDialog
          defaultDate={dayjs(value)}
          onConfirm={async (date) => {
            await mutate({
              id: studentId,
              dateOfEntry: date,
            })
            setShowEditDialog(false)
          }}
          onDismiss={() => setShowEditDialog(false)}
        />
      )}
    </Fragment>
  )
}
const SetStatusDataBox: FC<{
  studentId: string
  active: boolean
  name: string
}> = ({ studentId, active, name }) => {
  const [mutate] = usePatchStudentApi(studentId)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const saveStatus = async () => {
    await mutate({ active: !active })
    setShowStatusDialog(false)
  }
  return (
    <Card
      p={3}
      sx={{
        borderRadius: [0, "default"],
        display: "flex",
        alignItems: "center",
        backgroundColor: "surface",
      }}
    >
      <Box>
        <Typography.Body
          sx={{
            fontSize: 0,
            lineHeight: 1.4,
          }}
        >
          Status
        </Typography.Body>
        <Typography.Body sx={{ color: !active ? "warning" : undefined }}>
          {active ? "Active" : "Inactive"}
        </Typography.Body>
      </Box>
      <Button
        variant={active ? "outline" : "primary"}
        ml="auto"
        onClick={() => setShowStatusDialog(true)}
        sx={{ color: active ? "warning" : undefined }}
        data-cy={active ? "inactive-button" : "active-button"}
      >
        Set as {active ? "Inactive" : "Active"}
      </Button>
      {showStatusDialog && (
        <AlertDialog
          title={`Set as ${active ? "inactive" : "active"}?`}
          negativeText="Cancel"
          positiveText="Yes"
          body={`Are you sure you want to set ${name} as ${
            active ? "inactive" : "active"
          }?`}
          onNegativeClick={() => setShowStatusDialog(false)}
          onPositiveClick={() => saveStatus()}
        />
      )}
    </Card>
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

export default PageStudentProfile
