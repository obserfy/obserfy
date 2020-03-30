import React, { FC, useState } from "react"
import { navigate } from "gatsby-plugin-intl3"
import { useImmer } from "use-immer"
import nanoid from "nanoid"
import Box from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import Input from "../Input/Input"
import Button from "../Button/Button"
import { createStudentApi } from "../../api/students/createStudentApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import { getAnalytics } from "../../analytics"
import DateInput from "../DateInput/DateInput"
import TextArea from "../TextArea/TextArea"
import { Typography } from "../Typography/Typography"
import Select from "../Select/Select"
import useGetSchoolClasses from "../../api/useGetSchoolClasses"
import Chip from "../Chip/Chip"
import { Flex } from "../Flex/Flex"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import InformationalCard from "../InformationalCard/InformationalCard"
import { CLASS_SETTINGS_URL } from "../../pages/dashboard/settings/class"
import Card from "../Card/Card"
import { Icon } from "../Icon/Icon"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import WarningDialog from "../WarningDialog/WarningDialog"
import ProfilePicker from "../ProfilePicker/ProfilePicker"

enum GuardianRelationship {
  Other,
  Mother,
  Father,
}

enum Gender {
  NotSet,
  Male,
  Female,
}

interface Guardian {
  id: string
  guardianName: string
  email: string
  phone: string
  guardianNote: string
  relationship: GuardianRelationship
}

export const PageNewStudent: FC = () => {
  const [name, setName] = useState("")
  const [picture, setPicture] = useState<File>()
  const [studentId, setStudentId] = useState("")
  const [note, setNotes] = useState("")
  const [gender, setGender] = useState<Gender>(Gender.NotSet)
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [entryDate, setEntryDate] = useState<Date>()
  const [guardians, setGuardians] = useImmer<Guardian[]>([])
  const [selectedClasses, setSelectedClasses] = useImmer<string[]>([])
  const classes = useGetSchoolClasses()
  const isFormInvalid = name === ""

  async function createNewStudent(): Promise<void> {
    const response = await createStudentApi(getSchoolId(), {
      name,
      dateOfBirth,
    })
    getAnalytics()?.track("Student Created", {
      responseStatus: response.status,
      studentName: name,
    })
    if (response.status === 201) navigate("/dashboard/observe")
  }

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto" pb={4}>
        <BackNavigation to="/dashboard/observe" text="Home" />
        <Box mx={3}>
          <Flex alignItems="flex-end">
            <Typography.H4 mb={3}>New Student</Typography.H4>
            <ProfilePicker
              ml="auto"
              onChange={setPicture}
              value={picture}
              mb={2}
            />
          </Flex>
          <Input
            label="Name (Required)"
            width="100%"
            value={name}
            onChange={(e) => setName(e.target.value)}
            mb={3}
          />
          <DateInput
            label="Date of Birth"
            value={dateOfBirth}
            onChange={setDateOfBirth}
            mb={3}
          />
          <DateInput
            label="Entry Date"
            value={entryDate}
            onChange={setEntryDate}
            mb={3}
          />
          <Select
            label="Gender"
            mb={3}
            value={gender}
            onChange={(e) => setGender(parseInt(e.target.value, 10))}
          >
            <option value={Gender.NotSet}>Not Set</option>
            <option value={Gender.Male}>Male</option>
            <option value={Gender.Female}>Female</option>
          </Select>
          <Input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            label="Student ID"
            width="100%"
            mb={3}
          />
          <TextArea
            value={note}
            onChange={(e) => setNotes(e.target.value)}
            label="Notes"
            height={100}
          />
        </Box>
        <Typography.H5 m={3} mt={4}>
          CLASSES
        </Typography.H5>
        {classes.status === "success" && classes.data.length === 0 && (
          <EmptyClassDataPlaceholder />
        )}
        {classes.status === "loading" && <ClassesLoadingPlaceholder />}
        {classes.status !== "error" && (
          <Flex m={3}>
            {classes.data?.map((item) => {
              const selected = selectedClasses.includes(item.id)
              return (
                <Chip
                  key={item.id}
                  text={item.name}
                  activeBackground="primary"
                  isActive={selected}
                  onClick={() => {
                    if (selected) {
                      setSelectedClasses((draft) => {
                        return draft.filter(
                          (selection) => selection !== item.id
                        )
                      })
                    } else {
                      setSelectedClasses((draft) => {
                        draft.push(item.id)
                      })
                    }
                  }}
                />
              )
            })}
          </Flex>
        )}
        <Flex alignItems="center" mt={3}>
          <Typography.H5 m={3}>GUARDIANS</Typography.H5>
          <Button
            variant="outline"
            ml="auto"
            mr={3}
            onClick={() =>
              setGuardians((draft) => {
                draft.push({
                  id: nanoid(),
                  email: "",
                  guardianName: "",
                  guardianNote: "",
                  phone: "",
                  relationship: GuardianRelationship.Other,
                })
              })
            }
          >
            Add
          </Button>
        </Flex>
        {guardians.length === 0 && (
          <Card borderRadius={[0, "default"]} m={[0, 3]}>
            <Typography.Body m={3} color="textMediumEmphasis">
              This student doesn&apos;t have a guardian yet.
            </Typography.Body>
          </Card>
        )}
        {guardians.map((guardian, index) => (
          <GuardianForm
            key={guardian.id}
            value={guardian}
            onDelete={() => {
              setGuardians((draft) => {
                return draft.filter(({ id }) => id !== guardian.id)
              })
            }}
            onChange={(newGuardian) => {
              setGuardians((draft) => {
                draft[index] = newGuardian
              })
            }}
          />
        ))}
        <Box p={3} mt={3}>
          <Button
            width="100%"
            onClick={createNewStudent}
            disabled={isFormInvalid}
          >
            Save
          </Button>
        </Box>
      </Box>
    </>
  )
}

const ClassesLoadingPlaceholder: FC = () => (
  <Box m={3}>
    <LoadingPlaceholder width="100%" height="4rem" />
  </Box>
)

const EmptyClassDataPlaceholder: FC = () => (
  <Box mx={[0, 3]}>
    <InformationalCard
      buttonText="Go to Class Settings"
      message="Create your first class to track your student's class enrollment."
      to={CLASS_SETTINGS_URL}
    />
  </Box>
)

const GuardianForm: FC<{
  value: Guardian
  onChange: (newValue: Guardian) => void
  onDelete: (id: string) => void
}> = ({ value, onChange, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <Flex alignItems="flex-start" mb={4}>
        <Box pl={3} pr={0} width="100%">
          <Input
            value={value.guardianName}
            mb={2}
            label="Name"
            width="100%"
            onChange={(event) =>
              onChange({
                ...value,
                guardianName: event.target.value,
              })
            }
          />
          <Select
            label="Relationship"
            mb={2}
            onChange={(e) =>
              onChange({ ...value, relationship: parseInt(e.target.value, 10) })
            }
          >
            <option value={GuardianRelationship.Other}>Other</option>
            <option value={GuardianRelationship.Mother}>Mother</option>
            <option value={GuardianRelationship.Father}>Father</option>
          </Select>
          <Input
            type="email"
            value={value.email}
            mb={2}
            label="Email"
            width="100%"
            onChange={(event) =>
              onChange({
                ...value,
                email: event.target.value,
              })
            }
          />
          <Input
            type="phone"
            value={value.phone}
            mb={2}
            label="Phone"
            width="100%"
            onChange={(event) =>
              onChange({
                ...value,
                phone: event.target.value,
              })
            }
          />
          <TextArea
            value={value.guardianNote}
            label="Notes"
            width="100%"
            height={100}
            onChange={(event) =>
              onChange({
                ...value,
                guardianNote: event.target.value,
              })
            }
          />
        </Box>

        <Button
          variant="secondary"
          m={0}
          p={0}
          mt={22}
          sx={{ flexShrink: 0 }}
          onClick={() => setShowDeleteDialog(true)}
        >
          <Icon as={TrashIcon} fill="danger" />
        </Button>
      </Flex>
      {showDeleteDialog && (
        <WarningDialog
          title="Delete Guardian?"
          onDismiss={() => setShowDeleteDialog(false)}
          onAccept={() => {
            onDelete(value.id)
            setShowDeleteDialog(false)
          }}
          description={`${
            value.guardianName === "" ? "This guardian" : value.guardianName
          } will be removed.`}
        />
      )}
    </>
  )
}

export default PageNewStudent
