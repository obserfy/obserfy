/** @jsx jsx */
import { FC, useState, Fragment } from "react"
import { jsx } from "theme-ui"
import Box from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import { useGetStudent } from "../../api/useGetStudent"
import Card from "../Card/Card"
import Typography from "../Typography/Typography"
import { EDIT_GUARDIANS_URL, STUDENT_DETAILS_PAGE_URL } from "../../routes"
import dayjs from "../../dayjs"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import Button from "../Button/Button"
import Icon from "../Icon/Icon"
import Flex from "../Flex/Flex"
import Dialog from "../Dialog/Dialog"
import Input from "../Input/Input"
import DialogHeader from "../DialogHeader/DialogHeader"
import { Gender } from "../../api/students/usePostNewStudent"
import Select from "../Select/Select"
import DatePicker from "../DatePicker/DatePicker"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { Link } from "../Link/Link"

interface Props {
  id: string
}
export const PageStudentProfile: FC<Props> = ({ id }) => {
  const { data, status } = useGetStudent(id)

  if (status === "loading") {
    return (
      <Box>
        <LoadingPlaceholder width="100%" height="10em" mb={3} />
        <LoadingPlaceholder width="100%" height="10em" mb={3} />
        <LoadingPlaceholder width="100%" height="10em" mb={3} />
        <LoadingPlaceholder width="100%" height="10em" mb={3} />
      </Box>
    )
  }

  return (
    <Box maxWidth="maxWidth.sm" margin="auto" pb={4}>
      <BackNavigation
        to={STUDENT_DETAILS_PAGE_URL(id)}
        text="Student Overview"
      />
      <Card borderRadius={[0, "default"]} mb={3}>
        <NameDataBox value={data?.name} key={`name${data?.name}`} />
        <GenderDataBox value={data?.gender} key={`gender${data?.gender}`} />
        <StudentIdDataBox value={data?.customId} key={`id${data?.customId}`} />
        <DateOfBirthDataBox
          value={data?.dateOfBirth}
          key={`dob${data?.dateOfBirth}`}
        />
        <DateOfEntryDataBox
          value={data?.dateOfEntry}
          key={`doe${data?.dateOfEntry}`}
        />
      </Card>

      <Card borderRadius={[0, "default"]} mb={3}>
        <Flex sx={{ alignItems: "flex-start" }}>
          <Box px={3} py={3}>
            <Typography.Body
              fontSize={0}
              lineHeight={1}
              mb={2}
              color="textMediumEmphasis"
            >
              Classes
            </Typography.Body>
            {data?.classes?.length === 0 && (
              <Typography.Body lineHeight={1}>Not set</Typography.Body>
            )}
            {data?.classes?.map(() => {
              return <Typography.Body lineHeight={1}>Name</Typography.Body>
            })}
          </Box>

          <Button variant="outline" ml="auto" px={2} mt={3} mr={3}>
            <Icon as={EditIcon} m={0} />
          </Button>
        </Flex>
      </Card>

      <Card borderRadius={[0, "default"]}>
        <Flex sx={{ alignItems: "flex-start" }}>
          <Box px={3} pt={3}>
            <Typography.Body
              fontSize={0}
              lineHeight={1}
              color="textMediumEmphasis"
            >
              Guardians
            </Typography.Body>
            {data?.guardians?.length === 0 && (
              <Typography.Body lineHeight={1} mb={3} mt={2}>
                Not set
              </Typography.Body>
            )}
            {data?.guardians?.map(({ email, name }) => {
              return (
                <Box py={3}>
                  <Typography.Body lineHeight={1} mb={2}>
                    {name}
                  </Typography.Body>
                  <Typography.Body
                    lineHeight={1}
                    fontSize={1}
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
    </Box>
  )
}

const NameDataBox: FC<{ value?: string }> = ({ value }) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
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
            onAccept={() => setShowEditDialog(false)}
          />
          <Box backgroundColor="background" p={3}>
            <Input label="Name" sx={{ width: "100%" }} value={value} />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const GenderDataBox: FC<{ value?: number }> = ({ value }) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  return (
    <Fragment>
      <DataBox
        label="Gender"
        onEditClick={() => setShowEditDialog(true)}
        value={(() => {
          switch (value) {
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
            onAccept={() => setShowEditDialog(false)}
          />
          <Box backgroundColor="background" p={3}>
            <Select label="Gender" value={value}>
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

const StudentIdDataBox: FC<{ value?: string }> = ({ value }) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  return (
    <Fragment>
      <DataBox
        label="Student ID"
        value={value || "Not set"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Edit Student ID"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={() => setShowEditDialog(false)}
          />
          <Box backgroundColor="background" p={3}>
            <Input
              label="Student ID"
              sx={{ width: "100%" }}
              value={value}
              placeholder="Type an ID"
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const DateOfBirthDataBox: FC<{ value?: string }> = ({ value }) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [date, setDate] = useState(dayjs(value || 0))

  return (
    <Fragment>
      <DataBox
        label="Date of Birth"
        value={value ? dayjs(value).format("D MMMM YYYY") : "N/A"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title="Edit Date of Birth"
            onAcceptText="Save"
            onCancel={() => setShowEditDialog(false)}
            onAccept={() => setShowEditDialog(false)}
          />
          <Flex p={3} backgroundColor="background">
            <DatePicker value={date} onChange={setDate} />
          </Flex>
        </Dialog>
      )}
    </Fragment>
  )
}

const DateOfEntryDataBox: FC<{ value?: string }> = ({ value }) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [date, setDate] = useState(dayjs(value || 0))

  return (
    <Fragment>
      <DataBox
        label="Date of Entry"
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
    </Fragment>
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
      alignItems: "center",
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
    <Button variant="outline" ml="auto" px={2} onClick={onEditClick}>
      <Icon as={EditIcon} m={0} />
    </Button>
  </Flex>
)

export default PageStudentProfile
