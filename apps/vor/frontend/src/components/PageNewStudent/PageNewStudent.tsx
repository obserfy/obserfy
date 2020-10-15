import React, { FC, useState } from "react"
import { useImmer } from "use-immer"
import { Box, Button, Card, Flex } from "theme-ui"

import {t, Trans } from "@lingui/macro"
import { Link, navigate } from "../Link/Link"
import { useGetGuardian } from "../../api/guardians/useGetGuardian"
import Input from "../Input/Input"
import DateInput from "../DateInput/DateInput"
import TextArea from "../TextArea/TextArea"
import { Typography } from "../Typography/Typography"
import Select from "../Select/Select"
import useGetSchoolClasses from "../../api/classes/useGetSchoolClasses"
import Chip from "../Chip/Chip"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { NEW_STUDENT_URL, PICK_GUARDIAN_URL, STUDENTS_URL } from "../../routes"

import ProfilePicker from "../ProfilePicker/ProfilePicker"
import {
  Gender,
  GuardianRelationship,
  usePostNewStudent,
} from "../../api/students/usePostNewStudent"

import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import {
  setNewStudentCache,
  useCacheNewStudentFormData,
  useGetNewStudentFormCache,
} from "./newStudentFormCache"

import Icon from "../Icon/Icon"
import WarningDialog from "../WarningDialog/WarningDialog"
import GuardianRelationshipPickerDialog from "../GuardianRelationshipPickerDialog/GuardianRelationshipPickerDialog"
import GuardianRelationshipPill from "../GuardianRelationshipPill/GuardianRelationshipPill"
import EmptyClassDataPlaceholder from "../EmptyClassDataPlaceholder/EmptyClassDataPlaceholder"
import { Dayjs } from "../../dayjs"
import BackButton from "../BackButton/BackButton"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

export interface NewStudentFormData {
  name: string
  customId: string
  note: string
  gender: Gender
  dateOfBirth?: Dayjs
  dateOfEntry?: Dayjs
  guardians: Array<{
    id: string
    relationship: GuardianRelationship
  }>
  selectedClasses: string[]
  profileImageId: string
}

const DEFAULT_FORM_STATE: NewStudentFormData = {
  selectedClasses: [],
  guardians: [],
  dateOfEntry: undefined,
  dateOfBirth: undefined,
  gender: 0,
  note: "",
  customId: "",
  profileImageId: "",
  name: "",
}

interface Props {
  newGuardian?: {
    id: string
    relationship: GuardianRelationship
  }
}

export const PageNewStudent: FC<Props> = ({ newGuardian }) => {
  const cachedData = useGetNewStudentFormCache(DEFAULT_FORM_STATE)

  const [name, setName] = useState(cachedData.name)
  const [customId, setCustomId] = useState(cachedData.customId)
  const [note, setNotes] = useState(cachedData.note)
  const [gender, setGender] = useState<Gender>(cachedData.gender)
  const [dateOfBirth, setDateOfBirth] = useState(cachedData.dateOfBirth)
  const [dateOfEntry, setDateOfEntry] = useState(cachedData.dateOfEntry)
  const [profileImageId, setProfileImageId] = useState(
    cachedData.profileImageId
  )
  const [guardians, setGuardians] = useImmer<NewStudentFormData["guardians"]>(
    () => {
      if (
        newGuardian &&
        !cachedData.guardians.map(({ id }) => id).includes(newGuardian.id)
      ) {
        cachedData.guardians.push(newGuardian)
      }
      return cachedData.guardians
    }
  )
  const [selectedClasses, setSelectedClasses] = useImmer(
    cachedData.selectedClasses
  )
  const [mutate, { isLoading }] = usePostNewStudent()
  const classes = useGetSchoolClasses()
  const isFormInvalid = name === ""

  useCacheNewStudentFormData({
    name,
    customId,
    note,
    gender,
    dateOfBirth,
    dateOfEntry,
    guardians,
    selectedClasses,
    profileImageId,
  })

  const updateAllFormState = (data: NewStudentFormData): void => {
    setName(data.name)
    setProfileImageId(data.profileImageId)
    setCustomId(data.customId)
    setNotes(data.note)
    setGender(data.gender)
    setDateOfBirth(data.dateOfBirth)
    setDateOfEntry(data.dateOfEntry)
    setSelectedClasses(() => data.selectedClasses)
    setGuardians(() => data.guardians)
  }

  return (
    <>
      <TranslucentBar
        boxSx={{
          position: "sticky",
          top: 0,
          borderBottomWidth: 1,
          borderBottomColor: "borderSolid",
          borderBottomStyle: "solid",
        }}
      >
        <Flex sx={{ alignItems: "center", maxWidth: "maxWidth.sm" }} m="auto">
          <BackButton to={STUDENTS_URL} />
          <Breadcrumb>
            <BreadcrumbItem to={STUDENTS_URL}>
              <Trans>Students</Trans>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Trans>New</Trans>
            </BreadcrumbItem>
          </Breadcrumb>
          <Button
            ml="auto"
            p={isLoading ? 1 : 2}
            my={2}
            mr={3}
            onClick={async () => {
              const result = await mutate({
                classes: selectedClasses,
                name,
                customId,
                dateOfBirth,
                dateOfEntry,
                guardians,
                note,
                gender,
                profileImageId,
              })
              if (result?.ok) {
                // reset cache
                await setNewStudentCache(DEFAULT_FORM_STATE)
                await navigate(STUDENTS_URL)
              }
            }}
            disabled={isFormInvalid}
          >
            {isLoading ? <LoadingIndicator size={22} /> : "Save"}
          </Button>
        </Flex>
      </TranslucentBar>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={4} pt={3}>
        <Box mx={3}>
          <Flex sx={{ alignItems: "flex-end" }}>
            <Typography.H5 mb={3}>
              <Trans>New Student</Trans>
            </Typography.H5>
            <ProfilePicker
              ml="auto"
              onChange={setProfileImageId}
              value={profileImageId}
              mb={2}
            />
          </Flex>
          <Input
            label={t`Name (Required)`}
            sx={{ width: "100%" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            mb={3}
          />
          <DateInput
            label={t`Date of Birth`}
            value={dateOfBirth}
            onChange={setDateOfBirth}
            mb={3}
          />
          <DateInput
            label={t`Date of Entry`}
            value={dateOfEntry}
            onChange={setDateOfEntry}
            mb={3}
          />
          <Select
            label={t`Gender`}
            mb={3}
            value={gender}
            onChange={(e) => setGender(parseInt(e.target.value, 10))}
          >
            <option value={Gender.NotSet}>
              <Trans>Not Set</Trans>
            </option>
            <option value={Gender.Male}>
              <Trans>Male</Trans>
            </option>
            <option value={Gender.Female}>
              <Trans>Female</Trans>
            </option>
          </Select>
          <Input
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            label={t`Student ID`}
            sx={{ width: "100%" }}
            mb={3}
          />
          <TextArea
            value={note}
            onChange={(e) => setNotes(e.target.value)}
            label={t`Notes`}
            sx={{ height: 100 }}
          />
        </Box>
        <Typography.H5 m={3} mt={4}>
          <Trans>Classes</Trans>
        </Typography.H5>
        {classes.status === "success" && (classes.data?.length ?? 0) === 0 && (
          <EmptyClassDataPlaceholder />
        )}
        {classes.status === "loading" && <ClassesLoadingPlaceholder />}
        {classes.status !== "error" && (
          <Flex m={3}>
            {classes.data?.map((item) => {
              const selected = selectedClasses.includes(item.id)
              return (
                <Chip
                  mr={2}
                  mb={2}
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
        <Flex sx={{ alignItems: "center" }} mt={3}>
          <Typography.H5 m={3} mr="auto">
            <Trans>Guardians</Trans>
          </Typography.H5>
          <Link to={PICK_GUARDIAN_URL} data-cy="add-student">
            <Button variant="outline" mr={3}>
              <Trans>Add</Trans>
            </Button>
          </Link>
        </Flex>
        {guardians.length === 0 && (
          <Card sx={{ borderRadius: [0, "default"] }} mx={[0, 3]}>
            <Typography.Body m={3} color="textMediumEmphasis">
              <Trans>This student doesn&apos;t have a guardian yet.</Trans>
            </Typography.Body>
          </Card>
        )}
        {guardians.map((guardian, idx) => (
          <GuardianCard
            key={guardian.id}
            id={guardian.id}
            relationship={guardian.relationship}
            changeRelationship={(relationship) => {
              setGuardians((draft) => {
                draft[idx].relationship = relationship
              })
            }}
            onRemove={() => {
              setGuardians((draft) => {
                draft.splice(idx, 1)
              })
            }}
          />
        ))}
        <Button
          variant="outline"
          mr={3}
          my={3}
          ml="auto"
          color="danger"
          onClick={async () => {
            updateAllFormState(DEFAULT_FORM_STATE)
            await navigate(NEW_STUDENT_URL)
          }}
        >
          <Trans>Reset Form</Trans>
        </Button>
      </Box>
    </>
  )
}

const ClassesLoadingPlaceholder: FC = () => (
  <Box m={3}>
    <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} />
  </Box>
)

const GuardianCard: FC<{
  id: string
  relationship: GuardianRelationship
  changeRelationship: (relationship: GuardianRelationship) => void
  onRemove: () => void
}> = ({ id, relationship, onRemove, changeRelationship }) => {
  const guardian = useGetGuardian(id)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [showRelationshipDialog, setShowRelationShipDialog] = useState(false)

  return (
    <Card
      py={3}
      pr={2}
      mb={2}
      mx={[0, 3]}
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: [0, "default"],
      }}
    >
      <Flex
        onClick={() => setShowRelationShipDialog(true)}
        sx={{
          flexDirection: "column",
          width: "100%",
          alignItems: "start",
        }}
      >
        <Typography.Body sx={{ lineHeight: 1 }} mb={3} ml={3}>
          {guardian.data?.name}
        </Typography.Body>
        <GuardianRelationshipPill relationship={relationship} ml={3} />
      </Flex>
      <Button
        variant="secondary"
        ml="auto"
        onClick={() => setShowRemoveDialog(true)}
      >
        <Icon as={TrashIcon} />
      </Button>
      {showRemoveDialog && (
        <WarningDialog
          onDismiss={() => setShowRemoveDialog(false)}
          title="Remove Guardian?"
          description={`Are you sure you want to remove ${guardian.data?.name} from the list of guardians?`}
          onAccept={() => {
            onRemove()
            setShowRemoveDialog(false)
          }}
        />
      )}
      {showRelationshipDialog && (
        <GuardianRelationshipPickerDialog
          defaultValue={relationship}
          onAccept={(newRelationship) => {
            changeRelationship(newRelationship)
            setShowRelationShipDialog(false)
          }}
          onDismiss={() => {
            setShowRelationShipDialog(false)
          }}
        />
      )}
    </Card>
  )
}

export default PageNewStudent
