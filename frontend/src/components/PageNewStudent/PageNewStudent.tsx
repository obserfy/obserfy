import React, { FC, useCallback, useState } from "react"
import { useImmer } from "use-immer"
import { Link, navigate } from "gatsby-plugin-intl3"
import { useGetGuardian } from "../../api/useGetGuardian"
import Box from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import Input from "../Input/Input"
import Button from "../Button/Button"
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
import ProfilePicker from "../ProfilePicker/ProfilePicker"
import {
  Gender,
  GuardianRelationship,
  usePostNewStudent,
} from "../../api/students/usePostNewStudent"
import { PICK_GUARDIAN_URL } from "../../pages/dashboard/observe/students/guardians/pick"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import {
  useCacheNewStudentFormData,
  useGetNewStudentFormCache,
} from "./newStudentFormCache"
import { NEW_STUDENT_URL } from "../../pages/dashboard/observe/students/new"
import Icon from "../Icon/Icon"
import Pill from "../Pill/Pill"
import WarningDialog from "../WarningDialog/WarningDialog"

export interface NewStudentFormData {
  name: string
  picture?: File
  customId: string
  note: string
  gender: Gender
  dateOfBirth?: Date
  dateOfEntry?: Date
  guardians: Array<{
    id: string
    relationship: GuardianRelationship
  }>
  selectedClasses: string[]
}

const DEFAULT_FORM_STATE: NewStudentFormData = {
  selectedClasses: [],
  guardians: [],
  dateOfEntry: undefined,
  dateOfBirth: undefined,
  gender: 0,
  note: "",
  customId: "",
  picture: undefined,
  name: "",
}

interface Props {
  newGuardian?: {
    id: string
    relationship: GuardianRelationship
  }
}

export const PageNewStudent: FC<Props> = ({ newGuardian }) => {
  const [name, setName] = useState("")
  const [picture, setPicture] = useState<File>()
  const [customId, setCustomId] = useState("")
  const [note, setNotes] = useState("")
  const [gender, setGender] = useState<Gender>(Gender.NotSet)
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [dateOfEntry, setDateOfEntry] = useState<Date>()
  const [guardians, setGuardians] = useImmer<NewStudentFormData["guardians"]>(
    []
  )
  const [selectedClasses, setSelectedClasses] = useImmer<string[]>([])
  const [mutate] = usePostNewStudent()
  const classes = useGetSchoolClasses()
  const isFormInvalid = name === ""

  useCacheNewStudentFormData({
    name,
    picture,
    customId,
    note,
    gender,
    dateOfBirth,
    dateOfEntry,
    guardians,
    selectedClasses,
  })

  const updateAllFormState = useCallback(
    (cachedData: NewStudentFormData) => {
      setName(cachedData.name)
      setPicture(cachedData.picture)
      setCustomId(cachedData.customId)
      setNotes(cachedData.note)
      setGender(cachedData.gender)
      setDateOfBirth(cachedData.dateOfBirth)
      setDateOfEntry(cachedData.dateOfEntry)
      setSelectedClasses(() => cachedData.selectedClasses)
      setGuardians(() => {
        if (
          newGuardian &&
          !cachedData.guardians.map(({ id }) => id).includes(newGuardian.id)
        ) {
          cachedData.guardians.push(newGuardian)
        }
        return cachedData.guardians
      })
    },
    [newGuardian, setGuardians, setSelectedClasses]
  )
  useGetNewStudentFormCache(updateAllFormState)

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
            label="Date of Entry"
            value={dateOfEntry}
            onChange={setDateOfEntry}
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
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
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
          <Typography.H5 m={3} mr="auto">
            GUARDIANS
          </Typography.H5>
          <Link to={PICK_GUARDIAN_URL}>
            <Button variant="outline" mr={3}>
              Add
            </Button>
          </Link>
        </Flex>
        {guardians.length === 0 && (
          <Card borderRadius={[0, "default"]} mx={[0, 3]}>
            <Typography.Body m={3} color="textMediumEmphasis">
              This student doesn&apos;t have a guardian yet.
            </Typography.Body>
          </Card>
        )}
        {guardians.map((guardian) => (
          <GuardianCard
            key={guardian.id}
            id={guardian.id}
            relationship={guardian.relationship}
            onRemove={(id) => {
              setGuardians((draft) => {
                return draft.filter((item) => item.id !== id)
              })
            }}
          />
        ))}
        <Flex p={3} mt={3}>
          <Button
            variant="outline"
            mr={3}
            color="danger"
            onClick={() => {
              updateAllFormState(DEFAULT_FORM_STATE)
              navigate(NEW_STUDENT_URL)
            }}
          >
            Clear
          </Button>
          <Button
            width="100%"
            disabled={isFormInvalid}
            onClick={async () => {
              const result = await mutate({
                picture,
                student: {
                  classes: selectedClasses,
                  name,
                  customId,
                  dateOfBirth,
                  dateOfEntry,
                  guardians,
                  note,
                  gender,
                },
              })
              if (result.status === 201) {
                updateAllFormState(DEFAULT_FORM_STATE)
                await navigate("/dashboard/observe")
              }
            }}
          >
            Save
          </Button>
        </Flex>
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

const GuardianCard: FC<{
  id: string
  relationship: GuardianRelationship
  onRemove: (id: string) => void
}> = ({ id, relationship, onRemove }) => {
  const guardian = useGetGuardian(id)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

  return (
    <Card
      borderRadius={[0, 3]}
      py={3}
      pr={2}
      mb={2}
      display="flex"
      sx={{
        alignItems: "center",
      }}
    >
      <Flex alignItems="start" width="100%" flexDirection="column">
        <Typography.Body lineHeight={1} mb={3} ml={3}>
          {guardian.data?.name}
        </Typography.Body>
        <Pill
          ml={3}
          {...(() => {
            switch (relationship) {
              case GuardianRelationship.Father:
                return { text: "Father", backgroundColor: "orange" }
              case GuardianRelationship.Mother:
                return {
                  text: "Mother",
                  backgroundColor: "primary",
                  color: "onPrimary",
                }
              case GuardianRelationship.Other:
                return {
                  text: "Other",
                  backgroundColor: "",
                  color: "onSurface",
                  ml: 2,
                }
              default:
                return {
                  text: "N/A",
                  backgroundColor: "",
                  color: "onSurface",
                  ml: 2,
                }
            }
          })()}
        />
      </Flex>
      <Button
        variant="secondary"
        ml="auto"
        onClick={() => setShowRemoveDialog(true)}
      >
        <Icon as={TrashIcon} m={0} />
      </Button>
      {showRemoveDialog && (
        <WarningDialog
          onDismiss={() => {
            setShowRemoveDialog(false)
          }}
          onAccept={() => {
            onRemove(id)
            setShowRemoveDialog(false)
          }}
          title="Remove Guardian?"
          description={`Are you sure you want to remove ${guardian.data?.name} from the list of guardians?`}
        />
      )}
    </Card>
  )
}

export default PageNewStudent
