import { t, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { FC, Fragment, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import { borderTop } from "../../border"
import dayjs from "../../dayjs"
import { getFirstName } from "../../domain/person"
import { useDeleteGuardianRelation } from "../../hooks/api/guardians/useDeleteGuardianRelation"
import { usePatchStudentApi } from "../../hooks/api/students/usePatchStudentApi"
import { Gender } from "../../hooks/api/students/usePostNewStudent"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import {
  ADD_GUARDIAN_URL,
  EDIT_STUDENT_CLASS_URL,
  STUDENT_OVERVIEW_URL,
  STUDENT_PROFILE_GUARDIAN_PROFILE_URL,
  STUDENTS_URL,
} from "../../routes"
import AlertDialog from "../AlertDialog/AlertDialog"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import { Link } from "../Link/Link"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Select from "../Select/Select"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import Typography from "../Typography/Typography"

interface Props {
  studentId: string
}

export const PageStudentProfile: FC<Props> = ({ studentId }) => {
  const { data, status } = useGetStudent(studentId)

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
    <Box sx={{ maxWidth: "maxWidth.md" }} margin="auto" pb={4}>
      <TopBar
        breadcrumbs={[
          breadCrumb(t`Students`, STUDENTS_URL),
          breadCrumb(getFirstName(data), STUDENT_OVERVIEW_URL(studentId)),
          breadCrumb(t`Profile`),
        ]}
      />
      <Card sx={{ borderRadius: [0, "default"] }} mb={3} mx={[0, 3]}>
        <NameDataBox
          value={data?.name}
          key={`name${data?.name}`}
          studentId={studentId}
        />
        <GenderDataBox
          value={data?.gender}
          key={`gender${data?.gender}`}
          studentId={studentId}
        />
        <StudentIdDataBox
          value={data?.customId}
          key={`id${data?.customId}`}
          studentId={studentId}
        />
        <DateOfBirthDataBox
          value={data?.dateOfBirth}
          key={`dob${data?.dateOfBirth}`}
          studentId={studentId}
        />
        <DateOfEntryDataBox
          value={data?.dateOfEntry}
          key={`doe${data?.dateOfEntry}`}
          studentId={studentId}
        />
        <NotesDataBox
          value={data?.note}
          key={`note${data?.note}`}
          studentId={studentId}
        />
      </Card>

      <Card sx={{ borderRadius: [0, "default"] }} mb={3} mx={[0, 3]}>
        <Flex p={3} sx={{ alignItems: "center" }}>
          <Typography.H6>
            <Trans>Classes</Trans>
          </Typography.H6>
          <Link
            to={EDIT_STUDENT_CLASS_URL(studentId)}
            sx={{ ml: "auto" }}
            data-cy="edit-classes"
          >
            <Button data-cy="edit-class" variant="text" ml="auto" p={2}>
              <Trans>Edit</Trans>
            </Button>
          </Link>
        </Flex>

        <Box>
          {data?.classes?.length === 0 && (
            <Typography.Body p={3}>
              <Trans>No class has been set</Trans>
            </Typography.Body>
          )}
          {data?.classes?.map(({ id, name }) => (
            <Flex key={id} sx={{ ...borderTop }}>
              <Typography.Body p={3}>{name}</Typography.Body>
            </Flex>
          ))}
        </Box>
      </Card>

      <Card sx={{ borderRadius: [0, "default"] }} mx={[0, 3]}>
        <Flex sx={{ alignItems: "center" }} p={3}>
          <Typography.H6>
            <Trans>Guardians</Trans>
          </Typography.H6>
          <Link
            to={ADD_GUARDIAN_URL(studentId)}
            sx={{ ml: "auto" }}
            data-cy="add-guardian"
          >
            <Button data-cy="add-guardians" variant="text" p={2}>
              <Trans>Add</Trans>
            </Button>
          </Link>
        </Flex>

        {data?.guardians?.length === 0 && (
          <Typography.Body p={3}>
            <Trans>No guardians has been set</Trans>
          </Typography.Body>
        )}

        {data?.guardians?.map(({ id, email, name }) => (
          <GuardianItem
            key={id}
            studentId={studentId}
            guardianId={id}
            name={name}
            email={email}
            studentName={data?.name}
          />
        ))}
      </Card>

      <Box mt={3} mx={[0, 3]}>
        <SetStatusDataBox
          studentId={studentId}
          active={data?.active ?? false}
          name={data?.name ?? ""}
        />
      </Box>
    </Box>
  )
}

const GuardianItem: FC<{
  studentId: string
  studentName: string
  guardianId: string
  name: string
  email: string
}> = ({ studentId, studentName, guardianId, name, email }) => {
  const dialog = useVisibilityState()
  const removeGuardian = useDeleteGuardianRelation(guardianId, studentId)

  const handleRemoveGuardian = async () => {
    try {
      await removeGuardian.mutateAsync()
      dialog.hide()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Fragment>
      <Link to={STUDENT_PROFILE_GUARDIAN_PROFILE_URL(studentId, guardianId)}>
        <Flex
          p={2}
          sx={{
            ...borderTop,
            alignItems: "center",
            transition: "background-color 100ms ease-in-out",
            "&:hover": {
              backgroundColor: "primaryLightest",
            },
          }}
        >
          <Typography.Body
            p={2}
            sx={{
              width: "80%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </Typography.Body>
          <Typography.Body
            py={1}
            px={email ? 0 : 2}
            backgroundColor={email ? "transparent" : "tintWarning"}
            sx={{
              width: "100%",
              borderRadius: "default",
              fontWeight: email ? "normal" : "bold",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email || <Trans>No email set</Trans>}
          </Typography.Body>
          <Button
            data-cy={`remove-${name}`}
            variant="outline"
            p={1}
            mx={2}
            onClick={(e) => {
              e.preventDefault()
              dialog.show()
            }}
          >
            <Icon as={CloseIcon} fill="danger" />
          </Button>
        </Flex>
      </Link>
      {dialog.visible && (
        <AlertDialog
          title={t`Remove guardian?`}
          body={t`Do you want to remove ${name} from  ${studentName}'s list of guardians?`}
          positiveText={t`Delete`}
          loading={removeGuardian.isLoading}
          onNegativeClick={dialog.hide}
          onPositiveClick={handleRemoveGuardian}
        />
      )}
    </Fragment>
  )
}

const NameDataBox: FC<{ value?: string; studentId: string }> = ({
  value,
  studentId,
}) => {
  const { mutateAsync, status } = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [name, setName] = useState(value)
  const saveName = async () => {
    try {
      await mutateAsync({ name })
      setShowEditDialog(false)
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Fragment>
      <DataBox
        label={t`Name`}
        value={value ?? ""}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Name`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveName}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={t`Name`}
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
  const { mutateAsync, status } = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [gender, setGender] = useState(value)
  const saveGender = async () => {
    try {
      await mutateAsync({ gender })
      setShowEditDialog(false)
    } catch (e) {
      Sentry.captureException(e)
    }
  }
  const { i18n } = useLingui()
  return (
    <Fragment>
      <DataBox
        label={t`Gender`}
        onEditClick={() => setShowEditDialog(true)}
        value={(() => {
          switch (gender) {
            case 1:
              return t`Male`
            case 2:
              return t`Female`
            default:
              return t`Not Set`
          }
        })()}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Gender`}
            onAcceptText={t`Save`}
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
              label={t`Gender`}
              value={gender}
              onChange={(e) => {
                setGender(parseInt(e.target.value, 10))
              }}
            >
              <option value={Gender.NotSet}>{i18n._(t`Not Set`)}</option>
              <option value={Gender.Male}>{i18n._(t`Male`)}</option>
              <option value={Gender.Female}>{i18n._(t`Female`)}</option>
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
  const { mutateAsync, status } = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [customId, setCustomId] = useState(value)
  const saveCustomId = async () => {
    try {
      await mutateAsync({ customId })
      setShowEditDialog(false)
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Fragment>
      <DataBox
        label={t`Student ID`}
        value={customId || t`Not Set`}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Student ID`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveCustomId}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={t`Student ID`}
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

const NotesDataBox: FC<{ value?: string; studentId: string }> = ({
  value,
  studentId,
}) => {
  const { mutateAsync, status } = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [note, setNote] = useState(value)
  const saveNote = async () => {
    try {
      await mutateAsync({ note })
      setShowEditDialog(false)
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Fragment>
      <DataBox
        label={t`Notes`}
        value={note || "-"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Notes`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveNote}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={t`Notes`}
              sx={{ width: "100%" }}
              onChange={(e) => setNote(e.target.value)}
              value={note}
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
  const { mutateAsync } = usePatchStudentApi(studentId)
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
            try {
              await mutateAsync({
                dateOfBirth: date,
              })
              setShowEditDialog(false)
            } catch (e) {
              Sentry.captureException(e)
            }
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
  const { mutateAsync } = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <Fragment>
      <DataBox
        label={t`Date of Entry`}
        value={value ? dayjs(value).format("D MMMM YYYY") : "N/A"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <DatePickerDialog
          defaultDate={dayjs(value)}
          onConfirm={async (date) => {
            try {
              await mutateAsync({ dateOfEntry: date })
              setShowEditDialog(false)
            } catch (e) {
              Sentry.captureException(e)
            }
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
  const { i18n } = useLingui()
  const { mutateAsync } = usePatchStudentApi(studentId)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const saveStatus = async () => {
    try {
      await mutateAsync({ active: !active })
      setShowStatusDialog(false)
    } catch (e) {
      Sentry.captureException(e)
    }
  }
  const setActiveText = i18n._(t`Set as Active`)
  const setInactiveText = i18n._(t`Set as Inactive`)

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
        <Typography.Body sx={{ fontSize: 0 }}>
          <Trans>Status</Trans>
        </Typography.Body>
        <Typography.Body sx={{ color: !active ? "warning" : undefined }}>
          <Trans id={active ? "Active" : "Inactive"} />
        </Typography.Body>
      </Box>
      <Button
        variant={active ? "outline" : "primary"}
        ml="auto"
        onClick={() => setShowStatusDialog(true)}
        sx={{ color: active ? "warning" : undefined }}
        data-cy={active ? "inactive-button" : "active-button"}
      >
        <Trans id={active ? setInactiveText : setActiveText} />
      </Button>
      {showStatusDialog && (
        <AlertDialog
          title={active ? `${setInactiveText}?` : `${setActiveText}?`}
          negativeText={t`Cancel`}
          positiveText={t`Yes`}
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
        <Trans id={label} />
      </Typography.Body>
      <Typography.Body sx={{ lineHeight: 1.6 }}>
        <Trans id={value} />
      </Typography.Body>
    </Box>
    <Button
      variant="outline"
      ml="auto"
      px={2}
      onClick={onEditClick}
      aria-label={`edit-${label.toLowerCase()}`}
    >
      <Icon as={EditIcon} />
    </Button>
  </Flex>
)

export default PageStudentProfile
